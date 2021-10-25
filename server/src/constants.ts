export const __prod__ = process.env.NODE_ENV === "production";
export const MAGIC_SECRET_KEY = "sk_live_CC7317BA37549258";

export const MSG_USER_LOGGED_IN = "User was logged in.";
export const MSG_USER_SIGNED_UP = "User was signed up.";
export const MSG_USER_NOT_LOGGED_IN = "User is not logged in";

export enum REQ_USER_OPTIONS {
  USER_NOT_LOGGED_IN = 100,
}

export enum POST_TRANSFER_STATUS {
  TRANSFER_EXISTED = 101,
  TRANSFER_ERROR = 100,
  TRANSFER_SUCCESS = 1,
}

let RES_MESSAGES = {} as any;

RES_MESSAGES[POST_TRANSFER_STATUS.TRANSFER_SUCCESS] = "New Transfer saved.";
RES_MESSAGES[POST_TRANSFER_STATUS.TRANSFER_ERROR] =
  "Transfer couldn't be saved.";
RES_MESSAGES[POST_TRANSFER_STATUS.TRANSFER_EXISTED] =
  "Transfer couldn't be saved because a transfer with that phrase is active.";
RES_MESSAGES[REQ_USER_OPTIONS.USER_NOT_LOGGED_IN] = "User is not logged in";

export { RES_MESSAGES };
