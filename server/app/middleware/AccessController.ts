import { NextFunction, Request, Response } from "express";

import { IS_DEV } from "../config";
import { READ_ONLY, NON_LOCAL_READ_ONLY } from "../config.js";
import { isAdmin } from "./isAdmin.js";

export default class AccessController {
  public static authorizeAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (IS_DEV) {
      return next();
    }

    // allow if admin
    if (isAdmin(req.headers.cookie)) {
      return next();
    }

    let allowedAccess = true;

    // READ_ONLY check
    if (READ_ONLY) {
      allowedAccess = false;
    }

    // NON_LOCAL_READ_ONLY check
    const clientIp = req.headers["x-forwarded-for"] as string | undefined;
    if (NON_LOCAL_READ_ONLY && !AccessController.isIpPrivate(clientIp)) {
      allowedAccess = false;
    }

    if (allowedAccess) {
      return next();
    } else {
      res.status(403).send({
        success: false,
        message: "Permission Denied! read only access allowed.",
      });
    }
    next();
  }

  private static isIpPrivate(ip?: string) {
    if (!ip) return false;
    // https://www.npmjs.com/package/ip
    return (
      /^10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
      /^192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
      /^172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
      /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
      /^169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip)
    );
  }
}
