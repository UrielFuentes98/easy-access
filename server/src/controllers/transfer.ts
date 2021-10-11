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
    const registeredUser = await DI.userRepository.findOne({
      issuer: reqUser.issuer,
    });

    if (registeredUser) {
      const isTransferWithPhrase = await DI.transferRepository.findOne({
        phrase: transfer.phrase,
        owner: registeredUser.id,
      });

      if (isTransferWithPhrase) {
        return false;
      }
      const newTransfer = DI.transferRepository.create({
        ...transfer,
        owner: registeredUser.id,
      });

      await DI.transferRepository.persistAndFlush(newTransfer);
      return true;
    }

    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
