import fs from "fs";
import { __prod__ } from "../constants";

let credentials = {};
if (__prod__) {
  const privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/api.easy.urielf.xyz/privkey.pem",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/api.easy.urielf.xyz/cert.pem",
    "utf8"
  );
  const ca = fs.readFileSync(
    "/etc/letsencrypt/live/api.easy.urielf.xyz/chain.pem",
    "utf8"
  );

  credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };
}

export { credentials };
