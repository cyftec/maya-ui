import archiver from "archiver";
import fs from "fs";

export type ZipDependencies = {
  createArchive: typeof archiver;
  createWriteStream: typeof fs.createWriteStream;
};

const defaultDependencies: ZipDependencies = {
  createArchive: archiver,
  createWriteStream: fs.createWriteStream,
};

export const zipTheFolder = (
  srcDirPath: string,
  buildZipFilePath: `${string}.zip`,
  dependencies: ZipDependencies = defaultDependencies,
) => {
  const archive = dependencies.createArchive("zip", { zlib: { level: 9 } });
  const stream = dependencies.createWriteStream(buildZipFilePath);

  return new Promise<void>((resolve, reject) => {
    archive
      .directory(srcDirPath, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
};
