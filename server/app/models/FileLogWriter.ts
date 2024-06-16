import winston from "winston";

import { IS_DEV, LOG_FILE } from "../config";

enum LogTypes {
  LS = "ls",
  MKDIR = "mkdir",
  MOVE = "move",
  COPY = "copy",
  UPLOAD = "upload",
  DELETE = "delete",
}

export class FileLogWriter {
  private static logger = !LOG_FILE
    ? null
    : winston.createLogger({
        level: "info",
        format: winston.format.combine(
          winston.format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
          winston.format.printf((info) =>
            JSON.stringify({
              timestamp: info.timestamp,
              message: info.message,
              ip: info.ip,
              ua: info.ua,
            })
          )
        ),
        transports: [new winston.transports.File({ filename: LOG_FILE })],
      });
  private static writeLog(
    ip: string,
    ua: string,
    action: LogTypes,
    ...paths: string[]
  ) {
    const line = `${action} ${paths.join(" > ")}`;
    if (IS_DEV) {
      console.log("LOG:", line);
    }
    if (this.logger) {
      this.logger.info(line, { ip, ua });
    }
  }

  public static ls(ip: string, ua: string, path: string) {
    this.writeLog(ip, ua, LogTypes.LS, path);
  }
  public static mkdir(ip: string, ua: string, path: string) {
    this.writeLog(ip, ua, LogTypes.MKDIR, path);
  }
  public static move(
    ip: string,
    ua: string,
    srcPath: string,
    destPath: string
  ) {
    this.writeLog(ip, ua, LogTypes.MOVE, srcPath, destPath);
  }
  public static copy(
    ip: string,
    ua: string,
    srcPath: string,
    destPath: string
  ) {
    this.writeLog(ip, ua, LogTypes.COPY, srcPath, destPath);
  }
  public static upload(ip: string, ua: string, path: string) {
    this.writeLog(ip, ua, LogTypes.UPLOAD, path);
  }
  public static delete(ip: string, ua: string, path: string) {
    this.writeLog(ip, ua, LogTypes.DELETE, path);
  }
}
