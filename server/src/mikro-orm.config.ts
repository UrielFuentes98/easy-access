import { __prod__ } from "./app_constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User, Question, Transfer } from "./entities";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Question, User, Transfer],
  dbName: "easy_access",
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
