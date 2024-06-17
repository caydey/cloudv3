import CloudPath from "../models/CloudPath";
import { ExplorerHandler } from "./ExplorerHandler";
import { isAdmin } from "../middleware/isAdmin";
import { ENABLE_HIDDEN_FILES } from "../config";
import { Server } from "ws";
import { WebSocketObject } from "./WebSocketObject";
import SocketLogger from "./SocketLogger";

import { v4 as uuidv4 } from "uuid";
import { DoubleTriggerDelayer } from "../models/DoubleTriggerDelayer";
import { FileLogWriter } from "../models/FileLogWriter";
import { getRequestIp, getRequestUa } from "../helpers/getRequestInformation";
import { Request } from "express";

class ExploreSocket {
  private explorerHandler = new ExplorerHandler();

  private createSocketId() {
    return uuidv4().substring(0, 6);
  }

  init(wss: Server) {
    wss.on("connection", (ws: WebSocketObject, request: Request) => {
      ws.isAdmin = isAdmin(request.headers.cookie); // for dot files
      ws.doubleTriggerDelayer = new DoubleTriggerDelayer(1000); // 1 second delay before double directory change
      ws.id = this.createSocketId();
      ws.ip = getRequestIp(request);
      ws.ua = getRequestUa(request);

      SocketLogger.open(ws.id);

      ws.on("message", (event) => {
        // stop receiving updates on old path
        if (ws.aborter) ws.aborter();

        const cloudPath = CloudPath.Create(event.toString());
        this.registerWatcher(ws, cloudPath);
      });
      ws.on("close", () => {
        SocketLogger.close(ws.id!);
        if (ws.aborter) ws.aborter();
      });
    });
  }

  private registerWatcher(ws: WebSocketObject, cloudPath: CloudPath) {
    const showAllFiles = ws.isAdmin || !ENABLE_HIDDEN_FILES;

    SocketLogger.recieved(ws.id!, cloudPath.virtual);
    FileLogWriter.ls(ws.ip!, ws.ua!, cloudPath.virtual);
    ws.doubleTriggerDelayer?.start(() => {
      ws.aborter = this.explorerHandler.addExplorer(
        cloudPath,
        showAllFiles,
        (response) => {
          SocketLogger.send(ws.id!, response.data?.path ?? "/");
          ws.send(JSON.stringify(response));
        }
      );
    });
  }
}

export default new ExploreSocket();
