import CloudPath from "../models/CloudPath";

declare global {
  namespace Express {
    interface Locals {
      action?: "COPY" | "MOVE";
    }
    interface Request {
      saveCloudPath: CloudPath;
    }
  }
}
