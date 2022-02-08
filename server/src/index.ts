import "dotenv/config";
import "reflect-metadata";
import express from "express";
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from "@mikro-orm/core";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import passport from "passport";
import AWS from "aws-sdk";

import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { Question, Transfer, User, File } from "./entities";
import { transferRouter, userRouter } from "./routes";

const S3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
  questionRepository: EntityRepository<Question>;
  transferRepository: EntityRepository<Transfer>;
  fileRepository: EntityRepository<File>;
  S3_API: AWS.S3;
};

let main = async () => {
  DI.orm = await MikroORM.init(microConfig);
  DI.em = DI.orm.em;
  DI.userRepository = DI.orm.em.getRepository(User);
  DI.questionRepository = DI.orm.em.getRepository(Question);
  DI.transferRepository = DI.orm.em.getRepository(Transfer);
  DI.fileRepository = DI.orm.em.getRepository(File);
  DI.S3_API = S3;

  let app = express();

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    session({
      secret: "very secret secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: true,
      },
    })
  );
  app.use((_req, _res, next) => RequestContext.create(DI.orm.em, next));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/user", userRouter);
  app.use("/transfer", transferRouter);
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
