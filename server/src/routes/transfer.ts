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
  GET_FILES_NAMES,
  GET_FILE,
  POST_TRANSFER as POST_TRANSFER,
  REQ_USER,
  RES_MESSAGES,
  POST_DEACTIVATE,
} from "../constants";
import { responseBody, TransferData } from "../utils/interfaces";
import {
  getActiveTranfers,
  getTransferFile,
  getTransferFilesNames,
  validateQuestionAnswer,
  validateTransferAccess,
  deActivateTransfer,
} from "../controllers/transfer";
import { changeFilePath } from "../controllers/utils";
import { DI } from "../app";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.post("/file", upload.single("File"), async (req, res) => {
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

router.post("/de-activate", async (req, res) => {
  if (req.isAuthenticated()) {
    const transferPhrase = req.query.phrase as string;
    if (transferPhrase) {
      const response: responseBody = await deActivateTransfer(
        req.user,
        transferPhrase
      );
      if (response.key == POST_DEACTIVATE.SUCCESS) {
        res.status(StatusCodes.OK).json(response);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json(BAD_REQ_RES);
    }
  } else {
    const responseObj: responseBody = {
      key: REQ_USER.NOT_LOGGED_IN,
      message: RES_MESSAGES[REQ_USER.NOT_LOGGED_IN],
    };
    res.status(StatusCodes.BAD_REQUEST).json(responseObj);
  }
});

router.get("/files-names", async (req, res) => {
  const transferId = parseInt(req.query.transId as string);
  const accessCode = req.query.accessId as string;
  if (transferId && accessCode) {
    const validAccess = await validateTransferAccess(transferId, accessCode);
    if (validAccess) {
      DI.logger.debug(`Valid access to transfer: ${transferId}`);
      const response = await getTransferFilesNames(transferId);
      if (response.key == GET_FILES_NAMES.SUCCESS) {
        DI.logger.debug(
          `${response.filesNames?.length} files found for transfer: ${transferId}`
        );
        res.status(StatusCodes.OK).json(response);
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
      }
    } else {
      const response: responseBody = {
        key: GET_FILES_NAMES.ACCESS_ERROR,
        message: RES_MESSAGES[GET_FILES_NAMES.ACCESS_ERROR],
      };
      res.status(StatusCodes.BAD_REQUEST).json(response);
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(BAD_REQ_RES);
  }
});

router.get("/file", async (req, res) => {
  const transferId = parseInt(req.query.transId as string);
  const accessCode = req.query.accessId as string;
  const fileName = req.query.fileName as string;
  if (transferId && accessCode && fileName) {
    const validAccess = await validateTransferAccess(transferId, accessCode);
    if (validAccess) {
      const response = await getTransferFile(transferId, fileName);
      if (response.key == GET_FILE.SUCCESS) {
        const newFilePath = changeFilePath(response.tempFileName!);
        res.status(StatusCodes.OK).download(newFilePath, (err) => {
          if (err)
            DI.logger.error(`Error while sending response file.\n${err}`);
          else {
            fs.unlinkSync(newFilePath);
          }
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
      }
    } else {
      const response: responseBody = {
        key: GET_FILE.ACCESS_ERROR,
        message: RES_MESSAGES[GET_FILE.ACCESS_ERROR],
      };
      res.status(StatusCodes.BAD_REQUEST).json(response);
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(BAD_REQ_RES);
  }
});

router.get("/question", async (req, res) => {
  const queryPhrase = req.query.phrase as string;
  if (queryPhrase) {
    const response = await getQuestionFromPhrase(queryPhrase);
    res.status(StatusCodes.OK).json(response);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(BAD_REQ_RES);
  }
});

router.get("/validate-answer", async (req, res) => {
  const queryAnswer = req.query.answer as string;
  const queryTranId = parseInt(req.query.transferId as string);
  if (queryAnswer && queryTranId) {
    const response = await validateQuestionAnswer(queryTranId, queryAnswer);
    res.status(StatusCodes.OK).json(response);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(BAD_REQ_RES);
  }
});

router.get("/actives", async (req, res) => {
  if (req.isAuthenticated()) {
    const transfersData: TransferData[] = await getActiveTranfers(req.user);
    return res.status(StatusCodes.OK).json(transfersData);
  } else {
    const responseObj: responseBody = {
      key: REQ_USER.NOT_LOGGED_IN,
      message: RES_MESSAGES[REQ_USER.NOT_LOGGED_IN],
    };
    return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
  }
});

export const transferRouter = router;
