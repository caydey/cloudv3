import { Request } from "express";
const UNKNOWN_IP = "?.?.?.?";
const UNKNOWN_UA = "unknown";

export function getRequestIp(req: Request): string {
  if (req.headers["x-forwarded-for"])
    return (req.headers["x-forwarded-for"] as string).split(", ")[0];

  if (req.socket.remoteAddress) return req.socket.remoteAddress;

  return UNKNOWN_IP;
}

export function getRequestUa(req: Request): string {
  if (req.headers["user-agent"]) return req.headers["user-agent"];
  return UNKNOWN_UA;
}
