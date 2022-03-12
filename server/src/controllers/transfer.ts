import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { Transfer } from "../entities/";
import {
  GET_FILES_NAMES,
  GET_QUESTION,
  GET_FILE,
  POST_TRANSFER,
  RES_MESSAGES,
  VAL_ANSWER,
  POST_DEACTIVATE,
  BUCKET_NAME,
} from "../constants";
import { DI } from "../app";
import { v4 as uuidv4 } from "uuid";
import {
  getQuestionRes,
  GetTransferRes,
  GetFilesNamesRes,
  PostTransferRes,
  responseBody,
  valAnswerRes,
  TransferData,
} from "../utils/interfaces";
import { Readable } from "stream";
import { saveFileLocally } from "./utils";
import {
  getReaminingSecs,
  existsActiveTransfer,
  filterActiveTranfers,
} from "../utils/transfer";

export interface NewTransfer {
  phrase: string;
  duration: number;
  is_public: boolean;
}

export async function getActiveTranfers(
  reqUser: Express.User
): Promise<TransferData[]> {
  let transfersData: TransferData[] = [];
  const registeredUser = await DI.userRepository.findOne({
    issuer: reqUser.issuer,
  });
  if (registeredUser) {
    const transfersOfUser = await DI.transferRepository.find({
      owner: registeredUser.id,
      is_de_activated: false,
    });
    const activeTransfers = filterActiveTranfers(transfersOfUser);
    transfersData = activeTransfers.map((transfer) => {
      const seconds = getReaminingSecs(transfer);
      return { phrase: transfer.phrase, secs_remaining: seconds };
    });
  }
  return transfersData;
}

export async function deActivateTransfer(
  reqUser: Express.User,
  transferPhrase: string
) {
  const registeredUser = await DI.userRepository.findOne({
    issuer: reqUser.issuer,
  });
  if (registeredUser) {
    const transfersWithPhrase = await DI.transferRepository.find({
      phrase: transferPhrase,
      owner: registeredUser.id,
      is_de_activated: false,
    });
    const activeTransfer = filterActiveTranfers(transfersWithPhrase);
    if (activeTransfer.length == 1) {
      activeTransfer[0].is_de_activated = true;
      await DI.transferRepository.persistAndFlush(activeTransfer[0]);
      DI.logger.debug(`Transfer: ${activeTransfer[0].id} deactivated.`);
      return {
        key: POST_DEACTIVATE.SUCCESS,
        message: RES_MESSAGES[POST_DEACTIVATE.SUCCESS],
      } as responseBody;
    }
  }
  return {
    key: POST_DEACTIVATE.ERROR,
    message: RES_MESSAGES[POST_DEACTIVATE.ERROR],
  } as responseBody;
}

async function deleteTransfer(tranId: number) {
  try {
    const filesToDelte = await DI.fileRepository.find({
      file_transfer: tranId,
    });
    filesToDelte.forEach((file) =>
      DI.logger.debug(`File deleted. Id: ${file.id}`)
    );
    await DI.transferRepository.removeAndFlush(filesToDelte);

    const transferToDelete = await DI.transferRepository.findOne({
      id: tranId,
    });
    await DI.transferRepository.removeAndFlush(transferToDelete!);
    DI.logger.debug(`Transfer deleted. Id: ${transferToDelete!.id}`);
  } catch (err) {
    console.log(err);
  }
}

export async function saveNewTransfer(
  newTranVals: NewTransfer,
  reqUser: Express.User
): Promise<PostTransferRes> {
  try {
    const transfersWithPhrase = await DI.transferRepository.find({
      phrase: newTranVals.phrase,
      is_de_activated: false,
    });
    if (existsActiveTransfer(transfersWithPhrase) == false) {
      const registeredUser = await DI.userRepository.findOne({
        issuer: reqUser.issuer,
      });
      if (registeredUser) {
        const newTransfer = DI.transferRepository.create({
          ...newTranVals,
          owner: registeredUser.id,
          access_id: uuidv4(),
        });
        await DI.transferRepository.persistAndFlush(newTransfer);
        DI.logger.debug(`New Transfer registered. Id: ${newTransfer.id}.`);
        return {
          key: POST_TRANSFER.SUCCESS,
          message: RES_MESSAGES[POST_TRANSFER.SUCCESS],
          new_id: newTransfer.id,
        };
      }
    }
    DI.logger.debug(
      `Transfer with phrase ${newTranVals.phrase} already existed.`
    );
    return {
      key: POST_TRANSFER.EXISTED,
      message: RES_MESSAGES[POST_TRANSFER.EXISTED],
    };
  } catch (err) {
    DI.logger.error(err);
    return {
      key: POST_TRANSFER.ERROR,
      message: RES_MESSAGES[POST_TRANSFER.ERROR],
    };
  }
}

export async function saveTransferFile(
  file: Express.Multer.File,
  tranId: string
): Promise<responseBody> {
  if (await registerFile(file.originalname, tranId)) {
    if (await saveFileToS3(file, tranId)) {
      return {
        key: POST_TRANSFER.FILE_SUCCESS,
        message: RES_MESSAGES[POST_TRANSFER.FILE_SUCCESS],
      };
    }
  }
  await deleteTransfer(parseInt(tranId));
  return {
    key: POST_TRANSFER.ERROR,
    message: RES_MESSAGES[POST_TRANSFER.ERROR],
  };
}

async function registerFile(
  fileName: string,
  tranId: string
): Promise<boolean> {
  const tranIdNum = parseInt(tranId);
  try {
    const newFileEntry = DI.fileRepository.create({
      name: fileName,
      file_transfer: tranIdNum,
    });

    await DI.fileRepository.persistAndFlush(newFileEntry);
    DI.logger.debug(`New File registered. Id: ${newFileEntry.id}.`);
    return true;
  } catch (err) {
    DI.logger.error(err);
    return false;
  }
}

async function saveFileToS3(
  file: Express.Multer.File,
  tranId: string
): Promise<boolean> {
  const objectKey = `transfer_${tranId}/${file.originalname}`;
  const params: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: objectKey,
    Body: file.buffer,
  };
  try {
    const command = new PutObjectCommand(params);
    await DI.S3Client.send(command);
    DI.logger.debug(`File successfully uploaded. Key name: ${objectKey}`);
  } catch (err) {
    DI.logger.error("Error occured while trying to upload to S3 bucket", err);
    return false;
  }
  return true;
}

export async function validateTransferAccess(
  transId: number,
  accessCode: string
): Promise<boolean> {
  const transferMatched = await DI.transferRepository.findOne({
    id: transId,
    access_id: accessCode,
  });
  return transferMatched ? true : false;
}

export async function getTransferFilesNames(
  transId: number
): Promise<GetFilesNamesRes> {
  const files = await DI.fileRepository.find({ file_transfer: transId });
  if (files.length > 0) {
    const filesNames: string[] = files.map((file) => file.name);
    return {
      key: GET_FILES_NAMES.SUCCESS,
      message: RES_MESSAGES[GET_FILES_NAMES.SUCCESS],
      filesNames: filesNames,
    };
  }
  return {
    key: GET_FILES_NAMES.INTERNAL_ERROR,
    message: RES_MESSAGES[GET_FILES_NAMES.INTERNAL_ERROR],
  };
}

export async function getTransferFile(
  transId: number,
  fileName: string
): Promise<GetTransferRes> {
  try {
    const transferFile = await DI.fileRepository.findOne({
      file_transfer: transId,
      name: fileName,
    });
    if (transferFile) {
      const objectKey = `transfer_${transferFile.file_transfer.id}/${transferFile.name}`;
      const result = await fetchFile(objectKey);
      if (result.Body instanceof Readable) {
        const fileName = `tran-${transferFile.file_transfer.id}_${transferFile.name}`;
        await saveFileLocally(result.Body, fileName);
        DI.logger.debug(
          `$File: ${transferFile.name}, fetched for transfer: ${transId}.`
        );
        return {
          key: GET_FILE.SUCCESS,
          message: RES_MESSAGES[GET_FILE.SUCCESS],
          tempFileName: fileName,
        };
      }
    }
    return {
      key: GET_FILE.ERROR,
      message: RES_MESSAGES[GET_FILE.ERROR],
    };
  } catch (err) {
    DI.logger.error(`Error while getting file.\n ${err}`);
    return {
      key: GET_FILE.ERROR,
      message: RES_MESSAGES[GET_FILE.ERROR],
    };
  }
}

async function fetchFile(objectKey: string): Promise<GetObjectCommandOutput> {
  DI.logger.debug(`File object key to fetch: ${objectKey}`);
  const params: GetObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: objectKey,
  };
  const command = new GetObjectCommand(params);
  const s3Res = await DI.S3Client.send(command);
  return s3Res;
}

export async function getQuestionFromPhrase(
  phrase: string
): Promise<getQuestionRes> {
  try {
    const foundTransfersWithPhrase = await DI.transferRepository.find({
      phrase: phrase,
      is_de_activated: false,
    });
    const activeTransfers = filterActiveTranfers(foundTransfersWithPhrase);
    if (activeTransfers.length > 0) {
      if (activeTransfers.length == 1) {
        const question = await getQuestionFromTransfer(activeTransfers[0]);
        DI.logger.debug(
          `Question found for phrase '${phrase}'. Transfer Id: ${activeTransfers[0].id}`
        );
        return {
          key: GET_QUESTION.SUCCESS,
          message: RES_MESSAGES[GET_QUESTION.SUCCESS],
          transfer_id: activeTransfers[0].id,
          question,
        };
      } else {
        DI.logger.error(
          `Phrase '${phrase}' had more than one active transfer.`
        );
        return {
          key: GET_QUESTION.ERROR,
          message: RES_MESSAGES[GET_QUESTION.ERROR],
        };
      }
    } else {
      DI.logger.debug(`No transfer found for phrase '${phrase}'.`);
      return {
        key: GET_QUESTION.NOT_FOUND,
        message: RES_MESSAGES[GET_QUESTION.NOT_FOUND],
      };
    }
  } catch (err) {
    DI.logger.error(err.message);
    return {
      key: GET_QUESTION.ERROR,
      message: RES_MESSAGES[GET_QUESTION.ERROR],
    };
  }
}

async function getQuestionFromTransfer(transfer: Transfer): Promise<string> {
  const transferOwner = await DI.userRepository.findOne(
    {
      id: transfer.owner.id,
    },
    ["question_public", "question_private"]
  );
  return transfer.is_public
    ? transferOwner?.question_public?.question!
    : transferOwner?.question_private?.question!;
}

export async function validateQuestionAnswer(
  transferId: number,
  answer: string
): Promise<valAnswerRes> {
  let validAnswer: boolean = false;
  const transfer = await DI.transferRepository.findOne({ id: transferId }, [
    "owner",
  ]);
  if (transfer) {
    if (transfer.is_public) {
      validAnswer = answer === transfer.owner.answer_public;
    } else {
      validAnswer = answer === transfer.owner.answer_private;
    }
    if (validAnswer) {
      DI.logger.debug(`Correct answer provided for transfer: ${transfer.id}`);
      return {
        key: VAL_ANSWER.SUCCESS,
        message: RES_MESSAGES[VAL_ANSWER.SUCCESS],
        tran_access_id: transfer.access_id,
      } as valAnswerRes;
    } else {
      DI.logger.debug(`Wrong answer provided for transfer: ${transfer.id}`);
      return {
        key: VAL_ANSWER.ERROR,
        message: RES_MESSAGES[VAL_ANSWER.ERROR],
      } as valAnswerRes;
    }
  } else {
    DI.logger.error(`Transfer: ${transferId}, wasnt found.`);
    return {
      key: VAL_ANSWER.NOT_FOUND,
      message: RES_MESSAGES[VAL_ANSWER.NOT_FOUND],
    } as valAnswerRes;
  }
}
