import { Transfer } from "src/entities";
import { POST_TRANSFER } from "../constants";
import { DI } from "../index";
import { v4 as uuidv4 } from "uuid";

export interface NewTransfer {
  phrase: string;
  duration: number;
  is_public: boolean;
}

interface newTransferRes {
  key: POST_TRANSFER;
  new_id?: number;
}

export async function saveNewTransfer(
  newTranVals: NewTransfer,
  reqUser: Express.User
): Promise<newTransferRes> {
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
          new_id: newTransfer.id,
        };
      }
    }
    return { key: POST_TRANSFER.EXISTED };
  } catch (err) {
    console.error(err);
    return { key: POST_TRANSFER.ERROR };
  }
}

export function existsActiveTransfer(transfersToCheck: Transfer[]): boolean {
  const activeTransfers = transfersToCheck.filter((transfer) => {
    let minimumStartDate = new Date();
    minimumStartDate.setMinutes(
      minimumStartDate.getMinutes() - transfer.duration
    );
    return transfer.createdAt >= minimumStartDate;
  });

  return activeTransfers.length > 0;
}

export async function saveTransferFiles(
  file: Express.Multer.File,
  tranId: string
): Promise<newTransferRes> {
  console.log("here");
  if (await registerFile(file.originalname, tranId))
    return {
      key: POST_TRANSFER.FILE_SUCCESS,
    };
  else
    return {
      key: POST_TRANSFER.FILE_METADATA_ERROR,
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
