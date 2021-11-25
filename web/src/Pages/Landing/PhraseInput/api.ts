import { ResponseBody } from "app/utils/api";

export async function GET_TransferQuestion(phrase: string) {
  const response = await fetch(`/transfer/question?phrase=${phrase}`);
  return await response.json();
}

export interface GetQuestionRes extends ResponseBody {
  question: string;
  transfer_id: number;
}

export enum GET_QUESTION_KEYS {
  SUCCESS = 10,
  NOT_FOUND = 11,
  ERROR = 200,
}
