export interface responseBody {
  key: number;
  message: string;
}

export interface PostTransferResponse extends responseBody {
  new_id?: number;
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
  validAnswer: boolean;
}
