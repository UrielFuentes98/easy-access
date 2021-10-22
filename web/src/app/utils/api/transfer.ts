import { NewTransFormVals } from "Pages/NewTransfer";

interface NewTranSendVals extends Omit<NewTransFormVals, "duration"> {
  duration: number;
}

export async function POST_NewTransfer(newTransFormVals: NewTransFormVals) {
  const durationNum = parseInt(newTransFormVals.duration);
  const postVals: NewTranSendVals = {
    ...newTransFormVals,
    duration: durationNum,
  };

  const response = await fetch("/transfer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postVals),
  });
  return response;
}
