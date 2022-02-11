import { __prod__ } from "../constants";
import winston from "winston";

const transports = [];
if (__prod__) {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  );
}

const LoggerInstance = winston.createLogger({
  level: __prod__ ? "error" : "debug",
  transports,
});

export default LoggerInstance;
