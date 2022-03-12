export const RES_USER_MAGIC_LOGGED_IN = "User was logged in.";
export const RES_USER_MAGIC_SIGNED_UP = "User was signed up.";

export const MSG_REQ_ERR =
  "There was an error processing your request. Please try again.";
export const MSG_QUES_REQ_ERR =
  "There was an error loading the secret questions. Please refresh the page.";

export const __prod__ = process.env.NODE_ENV === "production";
export const DOMAIN = __prod__
  ? "https://api.easy.urielf.xyz"
  : "http://localhost:4000";
export const MAIGC_PK = __prod__
  ? "pk_live_F7F693C1F3037A5B"
  : "pk_live_0757F3ED045505F8";
