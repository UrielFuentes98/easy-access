export const __prod__ = process.env.NODE_ENV === "production";
export const MAGIC_SECRET_KEY = "sk_live_CC7317BA37549258";

export const MSG_USER_LOGGED_IN = "User was logged in.";
export const MSG_USER_SIGNED_UP = "User was signed up.";
export const MSG_USER_NOT_LOGGED_IN = "User is not logged in";

export const POST_TRANSFER_EXISTED = "post_transfer_existed_key";
export const POST_TRANSFER_ERROR = "post_transfer_error_key";
export const POST_TRANSFER_SUCCESS = "post_transfer_success_key";

export type POST_TRANSFER_OPTIONS =
  | "post_transfer_existed_key"
  | "post_transfer_error_key"
  | "post_transfer_success_key";

let RES_MESSAGES = {} as any;

RES_MESSAGES[POST_TRANSFER_SUCCESS] = "New Transfer saved.";
RES_MESSAGES[POST_TRANSFER_ERROR] = "Transfer couldn't be saved.";
RES_MESSAGES[POST_TRANSFER_EXISTED] =
  "Transfer couldn't be saved because a transfer with that phrase is active.";

export { RES_MESSAGES };
