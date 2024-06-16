import CloudPath from "../models/CloudPath";
import { ExplorerHandler } from "../models/ExplorerHandler";
import { isAdmin } from "../middleware/isAdmin";
import { ENABLE_HIDDEN_FILES } from "../config";
import { Server } from "ws";
import { WebSocketObject } from "./WebSocketObject";

class ExploreSocket {
  private explorerHandler = new ExplorerHandler();

  init(wss: Server) {
    wss.on("connection", (ws: WebSocketObject, request) => {
      // add 'admin' field to websocket object so we dont hide dot files from admins
      ws.isAdmin = isAdmin(request.headers.cookie);

      ws.on("message", (event) => {
        // stop receiving updates on old path
        if (ws.aborter) {
          ws.aborter();
        }

        const cloudPath = CloudPath.Create(event.toString());
        this.registerWatcher(ws, cloudPath);
      });
      ws.on("close", () => {
        if (ws.aborter) {
          ws.aborter();
        }
      });
    });
  }

  private registerWatcher(ws: WebSocketObject, cloudPath: CloudPath) {
    let showAllFiles = true;
    if (ENABLE_HIDDEN_FILES && !ws.isAdmin) {
      // hidden files are enabled and user is not admin
      showAllFiles = false;
    }

    ws.aborter = this.explorerHandler.addExplorer(
      cloudPath,
      showAllFiles,
      (response) => {
        ws.send(JSON.stringify(response));
      }
    );
  }
}

export default new ExploreSocket();
