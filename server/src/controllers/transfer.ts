import { DI } from "../index";

export interface Transfer {
  phrase: string;
  duration: number;
  is_public: boolean;
}

export async function saveNewTransfer(
  transfer: Transfer,
  reqUser: Express.User
): Promise<boolean> {
  try {
    if (await canAddTransfer(transfer)) {
      const registeredUser = await DI.userRepository.findOne({
        issuer: reqUser.issuer,
      });
      if (registeredUser) {
        const newTransfer = DI.transferRepository.create({
          ...transfer,
          owner: registeredUser.id,
        });
        await DI.transferRepository.persistAndFlush(newTransfer);
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function canAddTransfer(transfer: Transfer): Promise<boolean> {
  const transfersWithPhrase = await DI.transferRepository.find({
    phrase: transfer.phrase,
  });

  const activeTransfers = transfersWithPhrase.filter((transfer) => {
    let minimumSartDate = new Date();
    minimumSartDate.setMinutes(
      minimumSartDate.getMinutes() - transfer.duration
    );
    return transfer.createdAt >= minimumSartDate;
  });
  return activeTransfers.length === 0;
}
