export interface responseBody {
  key: number;
  message: string;
}

export interface PostTransferRes extends responseBody {
  new_id?: number;
}

export interface GetTransferRes extends responseBody {
  tempFileName?: string;
}

export interface GetFilesNamesRes extends responseBody {
  filesNames?: string[];
}

export interface questionReturnInfo {
  key: number;
  value: string;
}

export interface questionsRes extends responseBody {
  data?: questionReturnInfo[];
}

export interface getQuestionRes extends responseBody {
  question?: string;
  transfer_id?: number;
}

export interface valAnswerRes extends responseBody {
  tran_access_id?: string;
}
