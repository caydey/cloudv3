import express from "express";

import fs from "fs";
import multer from "multer";
import CloudPath from "../../models/CloudPath";
import {
  getRequestIp,
  getRequestUa,
} from "../../helpers/getRequestInformation";
import { FileLogWriter } from "../../models/FileLogWriter";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, req.saveCloudPath.system);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  // middleware 1 - authenticate 'path' paramater
  (req, res, next) => {
    // ?path
    const givenPath = req.query.path;
    // path is a directory
    if (typeof givenPath !== "string") {
      return res.status(400).send({
        success: false,
        message: "path paramater required",
      });
    }
    const cloudPath = CloudPath.Create(givenPath);

    // check path exists
    if (!fs.existsSync(cloudPath.system)) {
      return res.status(200).send({
        success: false,
        message: "given path not found",
      });
    }

    // check path is a folder
    if (!fs.statSync(cloudPath.system).isDirectory()) {
      return res.status(200).send({
        success: false,
        message: "given path is not a directory",
      });
    }

    FileLogWriter.upload(
      getRequestIp(req),
      getRequestUa(req),
      cloudPath.virtual
    );

    req.saveCloudPath = cloudPath; // accessed by multer

    next();
  },
  // middleware 2 - multer
  upload.single("files"),
  // middleware 3 - response
  (req, res) => {
    return res.status(200).send({
      success: true,
    });
  }
);

export default router;
