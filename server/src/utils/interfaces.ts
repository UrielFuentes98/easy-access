export interface responseBody {
  key: number;
  message: string;
}

export interface respPostTransfer extends responseBody {
  new_id?: number;
}
