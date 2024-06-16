import express from "express";
import fs from "fs-extra";
import path from "path";

import translateErrorCode from "../../helpers/translateErrorCode";
import CloudPath from "../../models/CloudPath";

const router = express.Router();

router.post("/", (req, res) => {
  // ?path ?dest
  const fromPath = req.body.path;
  const destPath = req.body.dest;
  if (typeof fromPath !== "string" || typeof destPath !== "string") {
    return res.status(400).send({
      success: false,
      message: "path or dest not defined",
    });
  }

  const fromCloudPath = CloudPath.Create(fromPath);
  if (!fs.existsSync(fromCloudPath.system)) {
    return res.status(200).send({
      success: false,
      message: "Path does not exist",
      data: { path: fromPath, dest: destPath },
    });
  }
  const destCloudPath = CloudPath.Create(destPath);
  let sysDestPath = destCloudPath.system;

  // mv file folder/ -> mv file folder/file
  if (
    fs.existsSync(destCloudPath.system) &&
    fs.statSync(destCloudPath.system).isDirectory()
  ) {
    sysDestPath = path.join(
      destCloudPath.system,
      path.basename(fromCloudPath.system)
    );
  }

  const errorHandler: fs.NoParamCallbackWithUndefined = (err) => {
    if (err) {
      // api response
      const errMessage = translateErrorCode(err.code);
      return res.status(200).send({
        success: false,
        message: errMessage,
        data: { path: fromPath, dest: destPath },
      });
    }
    res.status(200).send({
      success: true,
    });
  };

  if (res.locals.action === "MOVE") {
    fs.move(
      fromCloudPath.system,
      sysDestPath,
      { overwrite: true },
      errorHandler
    );
  } else if (res.locals.action === "COPY") {
    fs.copy(fromCloudPath.system, sysDestPath, errorHandler);
  }
});

export default router;
