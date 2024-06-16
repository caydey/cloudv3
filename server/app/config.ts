// static file server - production
export let STATIC_HOST = "/static";

// data root - production, (docker shared volume)
export let DATA_ROOT = "/data";

export const IS_DEV = process.env.NODE_ENV === "development";

if (IS_DEV) {
  // static file server - development
  STATIC_HOST = "http://localhost:3000/static";

  // data root - development
  if (!process.env.DATA_ROOT) {
    throw new Error("error DATA_ROOT not specified");
  }
  DATA_ROOT = process.env.DATA_ROOT;
}

// Hidden files character
export const HIDDEN_FILES_CHARACTER = "_";

// local access
export const READ_ONLY = process.env.READ_ONLY === "true";

// non local access
export const NON_LOCAL_READ_ONLY = process.env.NON_LOCAL_READ_ONLY === "true";

// enable hidden files
export const ENABLE_HIDDEN_FILES = process.env.ENABLE_HIDDEN_FILES === "true";

// access token
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// disclose disk size
export const HIDE_DISK_SIZE = process.env.HIDE_DISK_SIZE === "true";

export const LOG_FILE = process.env.LOG_FILE;
