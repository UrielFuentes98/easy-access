import { selectOption } from "features/InputField";

export {
  POST_NewTransfer,
  POST_SaveFiles,
  GET_FilesNames,
  GET_ActiveTransfers,
  POST_DeactivateTransfer,
} from "./transfer";
export { GET_SecretQuestions, POST_UserInfo, POST_LogoutUser } from "./user";

export type { TransferResponse } from "./transfer";

export interface ResponseBody {
  key: number;
  message: string;
}

export interface QuestionsResBody extends ResponseBody {
  data: selectOption[];
}

export interface FilesNamesResponse extends ResponseBody {
  filesNames: string[];
}

export enum GET_FILES_NAMES {
  SUCCESS = 40,
  INTERNAL_ERROR = 600,
  ACCESS_ERROR = 501,
}
