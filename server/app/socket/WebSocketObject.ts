import { WebSocket } from "ws";
import { WatchAborter } from "./WatchAborter";

interface AdditionalFields {
  isAlive: boolean;
  isAdmin: boolean;
  aborter: WatchAborter;
}

export type WebSocketObject = WebSocket & Partial<AdditionalFields>;
