import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "cookie-session";
import passport from "passport";
import cors from "cors";
import fs from "fs";
import { S3Client } from "@aws-sdk/client-s3";

import { AppDepenInjec, PORT, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { appLogger } from "./loaders";
import { Question, Transfer, User, File } from "./entities";
import { transferRouter, userRouter } from "./routes";
import path from "path";

export const DI = {} as AppDepenInjec;

let main = async () => {
  await loadDependencyInjector();

  //create file temp folder
  fs.mkdir(path.join(__dirname, "/temp"), { recursive: true }, (err) => {
    if (err) appLogger.error(`Error while creating temp folder.\n${err}`);
  });

  let app = express();

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    session({
      secret: "very secret secret",
    })
  );
  app.use(cors({ origin: "http://easy.urielf.xyz" }));
  app.use((_req, _res, next) => RequestContext.create(DI.orm.em, next));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/user", userRouter);
  app.use("/transfer", transferRouter);
  app.listen(PORT, () => {
    appLogger.info(`server started on localhost:${PORT}`);
  });
};

async function loadDependencyInjector() {
  const s3Client = new S3Client({
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
