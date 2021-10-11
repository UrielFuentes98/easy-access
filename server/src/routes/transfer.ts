import express from "express";
//import { passport, magic } from "../utils";
const router = express.Router();

/* Attach middleware to login endpoint */
router.post("/", async (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.body);
    console.log(req.user);
    res.status(200).end("Ok.");
  } else {
    return res.status(401).end("User is not logged in.");
  }
});

export const transferRouter = router;
