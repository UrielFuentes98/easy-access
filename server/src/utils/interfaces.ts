export interface responseBody {
  key: number;
  message: string;
}

export interface PostTransferResponse extends responseBody {
  new_id?: number;
}

export interface GetTransferResponse extends responseBody {
  tempFileName?: string;
}

export interface questionReturnInfo {
  key: number;
  value: string;
}

export interface questionsResponse extends responseBody {
  data?: questionReturnInfo[];
}

export interface getQuestionResponse extends responseBody {
  question?: string;
  transfer_id?: number;
}

export interface valAnswerResponse extends responseBody {
  tran_access_id?: string;
}
