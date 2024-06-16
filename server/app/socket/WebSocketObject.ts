import { WebSocket } from "ws";
import { WatchAborter } from "./WatchAborter";
import { DoubleTriggerDelayer } from "models/DoubleTriggerDelayer";

interface AdditionalFields {
  isAlive: boolean;
  isAdmin: boolean;
  id: string;
  aborter: WatchAborter;
  doubleTriggerDelayer: DoubleTriggerDelayer;
}

export type WebSocketObject = WebSocket & Partial<AdditionalFields>;
