import { responseBody } from "./utils/interfaces";

export const __prod__ = process.env.NODE_ENV === "production";
export const MAGIC_SECRET_KEY = "sk_live_CC7317BA37549258";

export const MSG_USER_LOGGED_IN = "User was logged in.";
export const MSG_USER_SIGNED_UP = "User was signed up.";
export const MSG_USER_NOT_LOGGED_IN = "User is not logged in";

export enum REQ_USER {
  NOT_LOGGED_IN = 200,
}

export enum GET_QUESTIONS {
  SUCCESS = 1,
  ERROR = 100,
}

export enum GET_QUESTION {
  SUCCESS = 10,
  NOT_FOUND = 11,
  ERROR = 200,
}

export enum VAL_ANSWER {
  SUCCESS = 20,
  NOT_FOUND = 21,
  ERROR = 300,
}

export enum POST_TRANSFER {
  SUCCESS = 30,
  FILE_SUCCESS = 31,
  FILE_METADATA_ERROR = 410,
  EXISTED = 401,
  ERROR = 402,
}

const BAD_REQ_KEY = 400;

let RES_MESSAGES = {} as any;

RES_MESSAGES[POST_TRANSFER.SUCCESS] = "New Transfer saved.";
RES_MESSAGES[POST_TRANSFER.ERROR] = "Transfer couldn't be saved.";
RES_MESSAGES[POST_TRANSFER.EXISTED] =
  "Transfer couldn't be saved because a transfer with that phrase is active.";
RES_MESSAGES[REQ_USER.NOT_LOGGED_IN] = "You're not logged in.";
RES_MESSAGES[POST_TRANSFER.FILE_SUCCESS] = "File saved.";
RES_MESSAGES[POST_TRANSFER.FILE_METADATA_ERROR] =
  "DB entry couldn't be made for file.";

RES_MESSAGES[GET_QUESTIONS.SUCCESS] = "Questions found.";
RES_MESSAGES[GET_QUESTIONS.ERROR] =
  "There was a problem finding the questions.";

RES_MESSAGES[GET_QUESTION.SUCCESS] = "Transfer found. Sending question.";
RES_MESSAGES[GET_QUESTION.NOT_FOUND] = "No transfer with that phrase found.";
RES_MESSAGES[GET_QUESTION.ERROR] =
  "There was a problem looking for the transfer.";

RES_MESSAGES[VAL_ANSWER.SUCCESS] = "Answer to question was correct.";
RES_MESSAGES[VAL_ANSWER.NOT_FOUND] = "Error ocurred with data.";
RES_MESSAGES[VAL_ANSWER.ERROR] = "Wrong answer. Try again.";

export { RES_MESSAGES };

export const BAD_REQ_RES = {
  key: BAD_REQ_KEY,
  message: "Error in communication ocurred.",
} as responseBody;
