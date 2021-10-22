import express from "express";
import { saveNewTransfer } from "../controllers/transfer";
import { StatusCodes } from "http-status-codes";
import {
  MSG_USER_NOT_LOGGED_IN,
  POST_TRANSFER_SUCCESS,
  RES_MESSAGES,
} from "../constants";

const router = express.Router();

router.post("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const result_key = await saveNewTransfer(req.body, req.user);
    const responseObj: responseBody = {
      key: result_key,
      message: RES_MESSAGES[result_key],
    };
    if (result_key === POST_TRANSFER_SUCCESS) {
      return res.status(StatusCodes.OK).json(responseObj);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
    }
  } else {
    return res.status(StatusCodes.BAD_REQUEST).end(MSG_USER_NOT_LOGGED_IN);
  }
});

export const transferRouter = router;
