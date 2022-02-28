import { API_HOST } from "app/constants";
import { NewTransferForm } from "Pages/NewTransfer";
import { ResponseBody } from ".";

interface NewTranSendVals {
  phrase: string;
  is_public: boolean;
  duration: number;
}

export interface TransferResponse extends ResponseBody {
  new_id: number;
}

export async function POST_NewTransfer(newTransFormVals: NewTransferForm) {
  const sendData = getTransferSendData(newTransFormVals);

  const response = await fetch(`${API_HOST}/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  });
  return response;
}

function getTransferSendData(
  newTransFormVals: NewTransferForm
): NewTranSendVals {
  const durationNum = parseInt(newTransFormVals.duration);

  const sendTransferVals: NewTranSendVals = {
    is_public: newTransFormVals.is_public,
    phrase: newTransFormVals.phrase.trim(),
    duration: durationNum,
  };
  return sendTransferVals;
}

export async function POST_SaveFiles(
  files: File[],
  tran_id: number
): Promise<boolean> {
  const result = files.every(async (file) => {
    const fileStatus = await POST_SaveFile(file, tran_id);
    return fileStatus;
  });
  return result;
}

async function POST_SaveFile(file: File, tran_id: number): Promise<boolean> {
  const filesData = new FormData();
  filesData.append("File", file);
  filesData.append("tranId", tran_id.toString());
  const response = await fetch(`${API_HOST}/transfer/file`, {
    method: "POST",
    body: filesData,
  });
  return response.ok;
}

export async function GET_FilesNames(transferId: number, accessId: string) {
  const response = await fetch(
    `${API_HOST}/transfer/files-names?transId=${transferId}&accessId=${accessId}`
  );
  return response;
}

export async function GET_ActiveTransfers() {
  const response = await fetch(`${API_HOST}/transfer/actives`);
  return response;
}

export async function POST_DeactivateTransfer(phrase: string) {
  const response = await fetch(
    `${API_HOST}/transfer/de-activate?phrase=${phrase}`,
    {
      method: "POST",
    }
  );
  return response;
}
