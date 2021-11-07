import express from "express";
import multer from "multer";
import {
  saveNewTransfer,
  saveTransferFiles,
  getQuestionFromPhrase,
} from "../controllers";
import { StatusCodes } from "http-status-codes";
import {
  POST_TRANSFER as POST_TRANSFER,
  REQ_USER,
  RES_MESSAGES,
} from "../constants";
import { responseBody } from "../utils/interfaces";

const router = express.Router();
const upload = multer();

router.post("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const response = await saveNewTransfer(req.body, req.user);
    if (response.key === POST_TRANSFER.SUCCESS) {
      return res.status(StatusCodes.OK).json(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }
  } else {
    const responseObj: responseBody = {
      key: REQ_USER.NOT_LOGGED_IN,
      message: RES_MESSAGES[REQ_USER.NOT_LOGGED_IN],
    };
    return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
  }
});

router.post("/files", upload.single("File"), async (req, res) => {
  if (req.isAuthenticated()) {
    const response = await saveTransferFiles(req.file!, req.body.tranId);
    if (response.key === POST_TRANSFER.FILE_SUCCESS) {
      return res.status(StatusCodes.OK).json(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }
  } else {
    const responseObj: responseBody = {
      key: REQ_USER.NOT_LOGGED_IN,
      message: RES_MESSAGES[REQ_USER.NOT_LOGGED_IN],
    };
    return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
  }
});

router.get("/question", async (req, res) => {
  const queryPhrase = req.query.phrase as string;
  const response = await getQuestionFromPhrase(queryPhrase);
  res.json(response);
});

export const transferRouter = router;
