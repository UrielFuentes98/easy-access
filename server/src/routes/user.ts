import express from "express";
import {
  MSG_USER_LOGGED_IN,
  MSG_USER_NOT_LOGGED_IN,
  MSG_USER_SIGNED_UP,
} from "../constants";
import { saveUserInfo } from "../controllers/user";
import { passport, magic } from "../utils";
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
    return res.status(200).json(req.user).end();
  } else {
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
    return res.status(200).end();
  } else {
    return res.status(401).end(MSG_USER_NOT_LOGGED_IN);
  }
});

export const userRouter = router;
