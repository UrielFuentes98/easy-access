import { Transfer } from "src/entities";
import { POST_TRANSFER_STATUS } from "../constants";
import { DI } from "../index";

export interface NewTransfer {
  phrase: string;
  duration: number;
  is_public: boolean;
}

interface newTransferRes {
  key: POST_TRANSFER_STATUS;
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
          key: POST_TRANSFER_STATUS.TRANSFER_SUCCESS,
          new_id: newTransfer.id,
        };
      }
    }
    return { key: POST_TRANSFER_STATUS.TRANSFER_EXISTED };
  } catch (err) {
    console.error(err);
    return { key: POST_TRANSFER_STATUS.TRANSFER_ERROR };
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
