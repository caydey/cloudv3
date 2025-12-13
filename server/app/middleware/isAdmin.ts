import { ACCESS_TOKEN } from "../config.js";
import * as cookie from "cookie";

export function isAdmin(cookies?: string) {
  if (ACCESS_TOKEN) {
    // server allows admin connections
    if (cookies) {
      // client has cookies
      const parsedCookies = cookie.parse(cookies);
      if (parsedCookies.Access_Token === ACCESS_TOKEN) {
        // auth
        return true;
      }
    }
  }
  return false;
}
