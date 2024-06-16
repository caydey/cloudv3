import express from "express";
import fs from "fs-extra";
import path from "path";
import { getMimeType } from "../../models/Mimetypes";
import CloudPath from "../../models/CloudPath";

import { STATIC_HOST } from "../../config";
import CloudSizeMonitor from "../../models/CloudSizeMonitor";
import translateErrorCode from "../../helpers/translateErrorCode";
import { FileStats } from "../../types/FileStats";
import { FileLogWriter } from "../../models/FileLogWriter";
import {
  getRequestIp,
  getRequestUa,
} from "../../helpers/getRequestInformation";

const router = express.Router();

export interface LsApiResponse {
  success: boolean;
  message?: string;
  data?: FileStats;
}

router.post("/", (req, res) => {
  // ?path
  const givenPath = req.body.path;
  if (!givenPath) {
    return res.status(400).send({
      success: false,
      message: "path not defined",
    });
  }

  const cloudPath = CloudPath.Create(givenPath);

  FileLogWriter.ls(getRequestIp(req), getRequestUa(req), cloudPath.virtual);

  lsApi(cloudPath, (response) => {
    res.status(200).send(response);
  });
});
export default router;

export function lsApi(
  cloudPath: CloudPath,
  callback: (response: LsApiResponse) => void
) {
  // check explore path is valid, path exists and we have read permissions
  validateExplorePath(cloudPath, (validateErrMessage) => {
    if (validateErrMessage) {
      const response = {
        success: false,
        message: validateErrMessage,
      };
      return callback(response);
    }

    explorePath(cloudPath, (exploreErrMessage, data) => {
      // exploreErrMessage "should" always be null as any errors "should" be
      // caught in validateExplorePath function
      if (exploreErrMessage) {
        const response = {
          success: false,
          message: exploreErrMessage,
        };
        return callback(response);
      }
      const response = {
        success: true,
        data,
      };
      callback(response);
    });
  });
}
// we use this function in websockets also

export function validateExplorePath(
  cloudPath: CloudPath,
  callback: (err?: string) => void
) {
  // path exists
  fs.access(cloudPath.system, fs.constants.W_OK, (err) => {
    if (err) {
      const errMessage = translateErrorCode(err.code);
      return callback(errMessage);
    }
    callback(undefined);
  });
}

function explorePath(
  cloudPath: CloudPath,
  callback: (err: string | undefined, fsStats?: FileStats) => void
) {
  // get file stats
  const fsStats = getFileStats(cloudPath);

  // if given path is not a directory just return its stats
  if (fsStats.type === "file") {
    return callback(undefined, fsStats);
  }

  // given path is directory add extra fields [children,free,total]
  fs.readdir(cloudPath.system, (err, files) => {
    if (err) {
      const errMessage = translateErrorCode(err.code);
      return callback(errMessage);
    } // error

    const children: FileStats[] = [];
    let childrenSize = 0;
    if (files) {
      // not empty directory
      files.forEach((file) => {
        const filePath = path.join(cloudPath.system, file);
        // when a file is deleted we somehow still reach here
        if (fs.existsSync(filePath)) {
          const childCloudPath = CloudPath.CreateTrustedPath(filePath);
          const childCloudStats: FileStats = getFileStats(childCloudPath);
          childrenSize += childCloudStats.size; // add to json
          children.push(childCloudStats); // add to json
        }
      });
    }
    fsStats.children = children;
    fsStats.size = childrenSize;
    // disk size stats
    const diskStats = CloudSizeMonitor.getCloudSizeStats();
    fsStats.free = diskStats.free;
    fsStats.total = diskStats.total;

    callback(undefined, fsStats);
  }); // /readdir
}

function getFileStats(cloudPath: CloudPath): FileStats {
  const fsStats = fs.statSync(cloudPath.system);
  let type = "file";
  let location: string | undefined = STATIC_HOST + cloudPath.virtual;
  if (fsStats.isDirectory()) {
    type = "directory";
    // only show location (http://localhost:3000/static/FILE) for files
    location = undefined;
  }
  return {
    path: cloudPath.virtual,
    name: path.basename(cloudPath.virtual) || "/",
    location,
    type,
    size: fsStats.size,
    modified: fsStats.mtime.getTime(),
    mime: getMimeType(cloudPath.system),
  };
}
