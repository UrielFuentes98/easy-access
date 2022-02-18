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

  const response = await fetch("/transfer", {
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
    ...newTransFormVals,
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
  const response = await fetch("/transfer/file", {
    method: "POST",
    body: filesData,
  });
  return response.ok;
}

export async function GET_FilesNames(transferId: number, accessId: string) {
  const response = await fetch(
    `/transfer/files-names?transId=${transferId}&accessId=${accessId}`
  );
  return response;
}
