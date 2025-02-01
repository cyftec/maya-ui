import archiver from "archiver";
import fs from "fs";

export const zipTheFolder = (
  srcDirPath: string,
  destZipFilePath: `${string}.zip`
) => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(destZipFilePath);

  return new Promise((resolve, reject) => {
    archive
      .directory(srcDirPath, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", resolve);
    archive.finalize();
  });
};
