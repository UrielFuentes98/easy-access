import { selectOption } from "features/InputField";

export { POST_NewTransfer } from "./transfer";
export { GET_SecretQuestions, POST_UserInfo } from "./user";

export type { TransferResponse } from "./transfer";

export interface ResponseBody {
  key: string;
  message: string;
}

export interface QuestionsResBody extends ResponseBody {
  data: selectOption[];
}
