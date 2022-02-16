import path from "path";
import fs from "fs";
import { DI } from "../";
import { Readable } from "stream";

export function changeFilePath(fileName: string): string {
  const filePath = path.join(__dirname, "../temp", fileName);
  const origFileName = fileName.split("_")[1];
  let newFilePath = path.join(__dirname, "../temp/", origFileName);
  fs.rename(filePath, newFilePath, (err) => {
    if (err) {
      DI.logger.error(`Error renaming temp file.\n ${err}`);
      newFilePath = filePath;
    }
  });
  return newFilePath;
}

export async function saveFileLocally(fileStream: Readable, fileName: string) {
  await new Promise<void>((resolve, reject) => {
    const tempFolder = path.join(__dirname, "../temp");
    const filePath = path.join(tempFolder, fileName);
    fileStream
      .pipe(fs.createWriteStream(filePath))
      .on("error", (err) => reject(err))
      .on("close", () => resolve());
  });
}
