import express from "express";
import {
  GET_QUESTIONS,
  MSG_USER_LOGGED_IN,
  MSG_USER_NOT_LOGGED_IN,
  MSG_USER_SIGNED_UP,
} from "../constants";
import { StatusCodes } from "http-status-codes";
import { saveUserInfo, getQuestions } from "../controllers";
import { passport, magic } from "../utils";
import { DI } from "../";
const router = express.Router();

/* Attach middleware to login endpoint */
router.post("/login", passport.authenticate("magic"), (req, res) => {
  if (req.user) {
    if (req.wasLogin) {
      res.status(200).end(MSG_USER_LOGGED_IN);
    } else {
      res.status(200).end(MSG_USER_SIGNED_UP);
    }
  } else {
    return res.status(401).end("Could not log user in.");
  }
});

/* Implement User Endpoints */

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    DI.logger.info("User info fetched.");
    return res.status(200).json(req.user).end();
  } else {
    DI.logger.info("User wasnt found to fetch.");
    return res.status(401).end(MSG_USER_NOT_LOGGED_IN);
  }
});

router.post("/register", async (req, res) => {
  if (req.isAuthenticated()) {
    const result = await saveUserInfo(req.body, req.user);
    if (result) {
      return res.status(200).end("User Info saved.");
    } else {
      return res.status(401).end("User Info not saved.");
    }
  } else {
    return res.status(401).end(MSG_USER_NOT_LOGGED_IN);
  }
});

router.post("/logout", async (req, res) => {
  if (req.isAuthenticated()) {
    await magic.users.logoutByIssuer(req.user.issuer);
    req.logout();
    DI.logger.info("User logged out.");
    return res.status(200).end();
  } else {
    DI.logger.info("User wasnt found to logout.");
    return res.status(401).end(MSG_USER_NOT_LOGGED_IN);
  }
});

router.get("/questions", async (_req, res) => {
  const questionEntries = await getQuestions();
  if (questionEntries.key == GET_QUESTIONS.SUCCESS) {
    res.status(StatusCodes.OK).json(questionEntries);
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(questionEntries);
  }
});

export const userRouter = router;
