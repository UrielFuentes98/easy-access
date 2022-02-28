export const RES_USER_MAGIC_LOGGED_IN = "User was logged in.";
export const RES_USER_MAGIC_SIGNED_UP = "User was signed up.";

export const MSG_REQ_ERR =
  "There was an error processing your request. Please try again.";
export const MSG_QUES_REQ_ERR =
  "There was an error loading the secret questions. Please refresh the page.";

export const __prod__ = process.env.NODE_ENV === "production";
export const API_HOST = __prod__ ? "http://api.easy.urielf.xyz" : "";
