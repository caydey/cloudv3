import { WebSocket } from "ws";
import { WatchAborter } from "./WatchAborter";
import { DoubleTriggerDelayer } from "models/DoubleTriggerDelayer";

interface AdditionalFields {
  isAlive: boolean;
  isAdmin: boolean;
  id: string;
  aborter: WatchAborter;
  doubleTriggerDelayer: DoubleTriggerDelayer;
  ip: string;
  ua: string;
}

export type WebSocketObject = WebSocket & Partial<AdditionalFields>;
