import { NewTransFormVals } from "Pages/NewTransfer";

interface NewTranSendVals {
  phrase: string;
  is_public: boolean;
  duration: number;
  file: any;
}

export async function POST_NewTransfer(newTransFormVals: NewTransFormVals) {
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
  newTransFormVals: NewTransFormVals
): NewTranSendVals {
  const durationNum = parseInt(newTransFormVals.duration);
  const fileFormData = new FormData();
  fileFormData.append("File", newTransFormVals.file);

  const sendTransferVals: NewTranSendVals = {
    phrase: newTransFormVals.phrase,
    is_public: newTransFormVals.is_public,
    duration: durationNum,
    file: Object.fromEntries(fileFormData),
  };
  console.log("here2", sendTransferVals);
  return sendTransferVals;
}
