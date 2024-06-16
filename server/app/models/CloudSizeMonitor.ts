import checkDiskSpace from "check-disk-space";

import { DATA_ROOT, HIDE_DISK_SIZE } from "../config.js";
import { CloudRootSize } from "types/CloudRootSize.js";

// only allow checkDiskSpace to be run at most once every minute
// by caching the output and updating it after the 'getSize' function
// is called

class CloudSizeMonitor {
  private readonly TIMEOUT = 1 * 60 * 1_000; // 1 minute
  private readonly NULL_DISK_SIZE: CloudRootSize = { free: -1, total: -1 };
  private lastQuery = 0;
  private lastSize: CloudRootSize = { free: 0, total: 0 };

  constructor() {
    this.updateSize();
  }

  private updateSize() {
    this.lastQuery = Date.now();
    checkDiskSpace(DATA_ROOT).then((diskSpace) => {
      this.lastSize = {
        free: diskSpace.free,
        total: diskSpace.size,
      };
    });
  }

  public getCloudSizeStats(): CloudRootSize {
    if (HIDE_DISK_SIZE) {
      return this.NULL_DISK_SIZE;
    }
    if (this.lastQuery < Date.now() - this.TIMEOUT) {
      this.updateSize();
    }

    return this.lastSize;
  }
}

export default new CloudSizeMonitor();
