import { Transfer } from "src/entities";
import { GET_QUESTION, POST_TRANSFER, RES_MESSAGES } from "../constants";
import { DI } from "../index";
import { v4 as uuidv4 } from "uuid";
import {
  getQuestionResponse,
  PostTransferResponse,
} from "src/utils/interfaces";

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
): Promise<PostTransferResponse> {
  if (await registerFile(file.originalname, tranId))
    return {
      key: POST_TRANSFER.FILE_SUCCESS,
      message: RES_MESSAGES[POST_TRANSFER.FILE_SUCCESS],
    };
  else
    return {
      key: POST_TRANSFER.FILE_METADATA_ERROR,
      message: RES_MESSAGES[POST_TRANSFER.FILE_METADATA_ERROR],
    };
}

async function registerFile(
  fileName: string,
  trandId: string
): Promise<boolean> {
  try {
    const fileNameParts = fileName.split(".");
    const originalName = fileNameParts[0];
    const uuidFileName = `${uuidv4()}.${fileNameParts[1]}`;
    const tranIdNum = parseInt(trandId);

    const newFileEntry = DI.fileRepository.create({
      uuid_name: uuidFileName,
      original_name: originalName,
      file_transfer: tranIdNum,
    });

    await DI.fileRepository.persistAndFlush(newFileEntry);
    return true;
  } catch (err) {
    return false;
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
