import { DOMAIN } from "app/constants";
import { ResponseBody } from "app/utils/api";

export async function GET_ValdiateAnswer(tranId: number, answer: string) {
  const response = await fetch(
    `${DOMAIN}/transfer/validate-answer?transferId=${tranId.toString()}&answer=${answer}`
  );
  return await response.json();
}

export interface ValAnswerRes extends ResponseBody {
  tran_access_id?: string;
}

export enum VAL_ANSWER_KEYS {
  SUCCESS = 20,
  NOT_FOUND = 21,
  ERROR = 300,
}
