import WebSocket from "ws";

import { Server as HttpServer } from "http";
import { Server } from "ws";
import Ping from "./Ping";
import ExploreSocket from "./ExploreSocket";

class Socket {
  private wss?: Server;

  mountServer(server: HttpServer) {
    this.wss = new WebSocket.Server({
      noServer: true,
      path: "/socket",
    });
    // emmit connection when user connects to socket
    server.on("upgrade", (request, socket, head) => {
      if (request.headers.upgrade?.toLowerCase() === "websocket") {
        this.wss?.handleUpgrade(request, socket, head, (socket) => {
          this.wss?.emit("connection", socket, request);
        });
      }
    });

    // setup pinging that will close dead clients
    Ping.init(this.wss);

    // handle explorer requests (every request)
    ExploreSocket.init(this.wss);
  }
}

export default new Socket();
