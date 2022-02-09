import { Transfer } from "../entities/";
import {
  GET_QUESTION,
  POST_TRANSFER,
  RES_MESSAGES,
  VAL_ANSWER,
} from "../constants";
import { DI } from "../index";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import {
  getQuestionResponse,
  PostTransferResponse,
  responseBody,
  valAnswerResponse,
} from "../utils/interfaces";
import { PutObjectRequest } from "aws-sdk/clients/s3";

export interface NewTransfer {
  phrase: string;
  duration: number;
  is_public: boolean;
}

export async function saveNewTransfer(
  newTranVals: NewTransfer,
  reqUser: Express.User
): Promise<PostTransferResponse> {
  try {
    const transfersWithPhrase = await DI.transferRepository.find({
      phrase: newTranVals.phrase,
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
        return {
          key: POST_TRANSFER.SUCCESS,
          message: RES_MESSAGES[POST_TRANSFER.SUCCESS],
          new_id: newTransfer.id,
        };
      }
    }
    return {
      key: POST_TRANSFER.EXISTED,
      message: RES_MESSAGES[POST_TRANSFER.EXISTED],
    };
  } catch (err) {
    console.error(err);
    return {
      key: POST_TRANSFER.ERROR,
      message: RES_MESSAGES[POST_TRANSFER.ERROR],
    };
  }
}

export function existsActiveTransfer(transfersToCheck: Transfer[]): boolean {
  const activeTransfers = filterActiveTranfers(transfersToCheck);
  return activeTransfers.length > 0;
}

export async function saveTransferFiles(
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
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function saveFileToS3(
  file: Express.Multer.File,
  tranId: string
): Promise<boolean> {
  const objectKey = `transfer_${tranId}/${file.originalname}`;
  const params: PutObjectRequest = {
    Bucket: process.env.BUCKET_NAME!,
    Key: objectKey,
    Body: fs.createReadStream(file.path),
  };
  try {
    const data = await DI.S3_API.upload(params).promise();
    console.log(`File uploaded successfully at ${data.Location}`);
  } catch (err) {
    console.log("Error occured while trying to upload to S3 bucket", err);
    return false;
  } finally {
    fs.unlinkSync(file.path); // Empty temp folder
  }
  return true;
}

async function deleteTransfer(tranId: number) {
  try {
    const filesToDelte = await DI.fileRepository.find({
      file_transfer: tranId,
    });
    await DI.transferRepository.removeAndFlush(filesToDelte);

    const transferToDelete = await DI.transferRepository.find({ id: tranId });
    await DI.transferRepository.removeAndFlush(transferToDelete);
  } catch (err) {
    console.log(err);
  }
}

export async function getQuestionFromPhrase(
  phrase: string
): Promise<getQuestionResponse> {
  try {
    const foundTransfersWithPhrase = await DI.transferRepository.find({
      phrase: phrase,
    });
    const activeTransfers = filterActiveTranfers(foundTransfersWithPhrase);
    if (activeTransfers.length > 0) {
      if (activeTransfers.length == 1) {
        const question = await getQuestionFromTransfer(activeTransfers[0]);
        return {
          key: GET_QUESTION.SUCCESS,
          message: RES_MESSAGES[GET_QUESTION.SUCCESS],
          transfer_id: activeTransfers[0].id,
          question,
        };
      } else {
        return {
          key: GET_QUESTION.ERROR,
          message: RES_MESSAGES[GET_QUESTION.ERROR],
        };
      }
    } else {
      return {
        key: GET_QUESTION.NOT_FOUND,
        message: RES_MESSAGES[GET_QUESTION.NOT_FOUND],
      };
    }
  } catch (err) {
    console.error(err.message);
    return {
      key: GET_QUESTION.ERROR,
      message: RES_MESSAGES[GET_QUESTION.ERROR],
    };
  }
}

export async function validateQuestionAnswer(
  transferId: number,
  answer: string
): Promise<valAnswerResponse> {
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
      return {
        key: VAL_ANSWER.SUCCESS,
        message: RES_MESSAGES[VAL_ANSWER.SUCCESS],
        tran_access_id: transfer.access_id,
      } as valAnswerResponse;
    } else {
      return {
        key: VAL_ANSWER.ERROR,
        message: RES_MESSAGES[VAL_ANSWER.ERROR],
      } as valAnswerResponse;
    }
  } else {
    return {
      key: VAL_ANSWER.NOT_FOUND,
      message: RES_MESSAGES[VAL_ANSWER.NOT_FOUND],
    } as valAnswerResponse;
  }
}

function filterActiveTranfers(transfersToCheck: Transfer[]): Transfer[] {
  const activeTransfers = transfersToCheck.filter((transfer) => {
    let minimumStartDate = new Date();
    minimumStartDate.setMinutes(
      minimumStartDate.getMinutes() - transfer.duration
    );
    return transfer.createdAt >= minimumStartDate;
  });
  console.log();
  return activeTransfers;
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
