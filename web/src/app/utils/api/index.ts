import { selectOption } from "features/InputField";

export { POST_NewTransfer, POST_SaveFiles, GET_Transfer } from "./transfer";
export { GET_SecretQuestions, POST_UserInfo, POST_LogoutUser } from "./user";

export type { TransferResponse } from "./transfer";

export interface ResponseBody {
  key: number;
  message: string;
}

export interface QuestionsResBody extends ResponseBody {
  data: selectOption[];
}
