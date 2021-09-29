import express from "express";
import { passport, magic } from "../utils";
const router = express.Router();

/* Attach middleware to login endpoint */
router.post("/login", passport.authenticate("magic"), (req, res) => {
  if (req.user) {
    if (req.wasLogin) {
      res.status(200).end("User was logged in.");
    } else {
      res.status(200).end("User was signed up.");
    }
  } else {
    return res.status(401).end("Could not log user in.");
  }
});

/* 5️⃣ Implement User Endpoints */

/* Implement Get Data Endpoint */
router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user).end();
  } else {
    return res.status(401).end(`User is not logged in.`);
  }
});

/* Implement Logout Endpoint */
router.post("/logout", async (req, res) => {
  if (req.isAuthenticated()) {
    await magic.users.logoutByIssuer(req.user.issuer);
    req.logout();
    return res.status(200).end();
  } else {
    return res.status(401).end(`User is not logged in.`);
  }
});

export const userRouter = router;
