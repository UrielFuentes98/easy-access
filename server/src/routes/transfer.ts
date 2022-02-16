import express from "express";
import multer from "multer";
import fs from "fs";
import {
  saveNewTransfer,
  saveTransferFiles,
  getQuestionFromPhrase,
} from "../controllers";
import { StatusCodes } from "http-status-codes";
import {
  BAD_REQ_RES,
  GET_TRANSFER,
  POST_TRANSFER as POST_TRANSFER,
  REQ_USER,
  RES_MESSAGES,
} from "../constants";
import { responseBody } from "../utils/interfaces";
import {
  getTransferFile,
  validateQuestionAnswer,
} from "../controllers/transfer";
import { changeFilePath } from "../controllers/utils";
import { DI } from "../";

const router = express.Router();
const upload = multer({
  dest: "temp/",
  limits: { fieldSize: 8 * 1024 * 1024 },
});

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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  } else {
    const responseObj: responseBody = {
      key: REQ_USER.NOT_LOGGED_IN,
      message: RES_MESSAGES[REQ_USER.NOT_LOGGED_IN],
    };
    return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
  }
});

router.get("/", async (req, res) => {
  const transferId = parseInt(req.query.transId as string);
  const accessCode = req.query.accessId as string;
  const response = await getTransferFile(transferId, accessCode);
  if (response.key == GET_TRANSFER.SUCCESS) {
    const newFilePath = changeFilePath(response.tempFileName!);
    res.status(StatusCodes.OK).sendFile(newFilePath, (err) => {
      if (err) DI.logger.error(`Error while sending response file.\n${err}`);
      else {
        fs.unlinkSync(newFilePath);
      }
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
});

router.get("/question", async (req, res) => {
  const queryPhrase = req.query.phrase as string;
  const response = await getQuestionFromPhrase(queryPhrase);
  res.status(StatusCodes.OK).json(response);
});

router.get("/valAnswer", async (req, res) => {
  const queryAnswer = req.query.answer as string;
  const queryTranId = parseInt(req.query.transferId as string);
  if (queryAnswer && queryTranId) {
    const response = await validateQuestionAnswer(queryTranId, queryAnswer);
    res.status(StatusCodes.OK).json(response);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(BAD_REQ_RES);
  }
});

export const transferRouter = router;
