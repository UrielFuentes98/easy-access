import express from "express";
import { saveNewTransfer } from "../controllers/transfer";
import { StatusCodes } from "http-status-codes";
import { MSG_USER_NOT_LOGGED_IN } from "../constants";

const router = express.Router();

router.post("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const result = await saveNewTransfer(req.body, req.user);
    if (result) {
      return res.status(StatusCodes.OK).end("New Transfer saved.");
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .end("Transfer couldn't be saved.");
    }
  } else {
    return res.status(StatusCodes.BAD_REQUEST).end(MSG_USER_NOT_LOGGED_IN);
  }
});

export const transferRouter = router;
