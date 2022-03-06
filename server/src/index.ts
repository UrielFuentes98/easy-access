import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import passport from "passport";
import fs from "fs";
import https from "https";
import { S3Client } from "@aws-sdk/client-s3";

import { AppDepenInjec, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { appLogger } from "./loaders";
import { Question, Transfer, User, File } from "./entities";
import { transferRouter, userRouter } from "./routes";
import path from "path";
import { credentials, sessionConfig } from "./utils";

export const DI = {} as AppDepenInjec;

let main = async () => {
  await loadDependencyInjector();

  //create file temp folder
  fs.mkdir(path.join(__dirname, "/temp"), { recursive: true }, (err) => {
    if (err) appLogger.error(`Error while creating temp folder.\n${err}`);
  });

  let app = express();

  app.use(logger(__prod__ ? "common" : "dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session(sessionConfig));
  app.use((_req, _res, next) => RequestContext.create(DI.orm.em, next));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static("public"));
  app.use("/user", userRouter);
  app.use("/transfer", transferRouter);

  if (__prod__) {
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
      appLogger.info("HTTPS Server running on port 443");
    });
  } else {
    app.listen(4000, () => {
      appLogger.info("server started on localhost:4000");
    });
  }
};

async function loadDependencyInjector() {
  const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });

  DI.orm = await MikroORM.init(microConfig);
  DI.em = DI.orm.em;
  DI.userRepository = DI.orm.em.getRepository(User);
  DI.questionRepository = DI.orm.em.getRepository(Question);
  DI.transferRepository = DI.orm.em.getRepository(Transfer);
  DI.fileRepository = DI.orm.em.getRepository(File);
  DI.S3Client = s3Client;
  DI.logger = appLogger;
}

main().catch((err) => {
  appLogger.error(err);
});
