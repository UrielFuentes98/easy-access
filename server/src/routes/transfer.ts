import express from "express";
import multer from "multer";
import { saveNewTransfer, saveTransferFiles } from "../controllers";
import { StatusCodes } from "http-status-codes";
import {
  POST_TRANSFER_STATUS as POST_TRANSFER_STATUS,
  REQ_USER_OPTIONS,
  RES_MESSAGES,
} from "../constants";
import { responseBody, respPostTransfer } from "../utils/interfaces";

const router = express.Router();
const upload = multer();

router.post("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const result = await saveNewTransfer(req.body, req.user);
    const responseObj: respPostTransfer = {
      ...result,
      message: RES_MESSAGES[result.key],
    };
    if (result.key === POST_TRANSFER_STATUS.TRANSFER_SUCCESS) {
      return res.status(StatusCodes.OK).json(responseObj);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
    }
  } else {
    const responseObj: responseBody = {
      key: REQ_USER_OPTIONS.USER_NOT_LOGGED_IN,
      message: RES_MESSAGES[REQ_USER_OPTIONS.USER_NOT_LOGGED_IN],
    };
    return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
  }
});

router.post("/files", upload.single("File"), async (req, res) => {
  if (req.isAuthenticated()) {
    const result = await saveTransferFiles(req.file!, req.body.tranId);
    const responseObj: respPostTransfer = {
      ...result,
      message: RES_MESSAGES[result.key],
    };
    if (result.key === POST_TRANSFER_STATUS.FILE_SUCCESS) {
      return res.status(StatusCodes.OK).json(responseObj);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
    }
  } else {
    const responseObj: responseBody = {
      key: REQ_USER_OPTIONS.USER_NOT_LOGGED_IN,
      message: RES_MESSAGES[REQ_USER_OPTIONS.USER_NOT_LOGGED_IN],
    };
    return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
  }
});

export const transferRouter = router;
