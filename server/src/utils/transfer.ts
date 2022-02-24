import { Transfer } from "src/entities";

export function getReaminingSecs(transfer: Transfer): number {
  const diffTime = Math.abs(Date.now() - transfer.createdAt.getTime());
  const diffSeconds = Math.ceil(diffTime / 1000);
  return transfer.duration * 60 - diffSeconds;
}

export function existsActiveTransfer(transfersToCheck: Transfer[]): boolean {
  const activeTransfers = filterActiveTranfers(transfersToCheck);
  return activeTransfers.length > 0;
}

export function filterActiveTranfers(transfersToCheck: Transfer[]): Transfer[] {
  const activeTransfers = transfersToCheck.filter((transfer) => {
    let minimumStartDate = new Date();
    minimumStartDate.setMinutes(
      minimumStartDate.getMinutes() - transfer.duration
    );
    return transfer.createdAt >= minimumStartDate;
  });
  return activeTransfers;
}
