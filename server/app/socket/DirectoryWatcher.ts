import fs from "fs";
import { FSWatcher } from "fs-extra";

import { LsApiResponse, lsApi, validateExplorePath } from "../api/user/ls";
import { WatchAborter } from "./WatchAborter";
import { HIDDEN_FILES_CHARACTER } from "../config";
import CloudPath from "../models/CloudPath";
import { DoubleTriggerDelayer } from "../models/DoubleTriggerDelayer";

import equal from "fast-deep-equal";

export interface Watcher {
  showAllFiles: boolean;
  callback: (wsData: LsApiResponse) => void;
}

export class DirectoryWatcher {
  private readonly cloudPath: CloudPath;

  private readonly FS_WATCH_DELAY = 100;
  private doubleTriggerDelayer = new DoubleTriggerDelayer(2000);

  private watchers: Map<number, Watcher> = new Map();
  private fileWatcher?: FSWatcher;
  private lastResponse?: LsApiResponse;
  private hiddenLastResponse?: LsApiResponse;
  private watcherIdCounter = 0;

  constructor(cloudPath: CloudPath) {
    this.cloudPath = cloudPath;
  }

  private startWatching() {
    this.lastResponse = undefined;
    this.hiddenLastResponse = undefined;
    validateExplorePath(this.cloudPath, (errMessage) => {
      if (errMessage) {
        return this.broadcastResponse({
          success: false,
          message: errMessage,
        });
      }

      this.doubleTriggerDelayer.start(this.update.bind(this));

      let timer: NodeJS.Timeout;
      this.fileWatcher = fs.watch(this.cloudPath.system);
      this.fileWatcher.addListener("change", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.doubleTriggerDelayer.start(this.update.bind(this));
        }, this.FS_WATCH_DELAY);
      });
    });
  }

  private update() {
    lsApi(this.cloudPath, (response) => {
      // exploreApi returned error, abort all future updates
      if (!response.success) {
        this.fileWatcher?.removeAllListeners();
      }
      this.broadcastResponse(response);
    });
  }

  private broadcastResponse(response: LsApiResponse) {
    // create response clone with the dot files hidden
    const clonedData = Object.assign({}, response.data);
    const hiddenFilesResponse = { success: response.success, data: clonedData };
    if (hiddenFilesResponse.success && hiddenFilesResponse.data.children) {
      hiddenFilesResponse.data.children = [];
      hiddenFilesResponse.data.size = 0; // hide size that the dot files take up
      response.data?.children?.forEach((child) => {
        if (!child.name.startsWith(HIDDEN_FILES_CHARACTER)) {
          // not hidden file
          hiddenFilesResponse.data?.children?.push(child);
          hiddenFilesResponse.data.size += child.size;
        }
      });
    }

    // dont resend same response
    if (equal(hiddenFilesResponse, this.hiddenLastResponse)) return;

    // update last responses
    this.hiddenLastResponse = hiddenFilesResponse;
    this.lastResponse = response;

    // broadcast response to all watchers
    this.watchers.forEach(({ callback, showAllFiles }) => {
      callback(showAllFiles ? response : hiddenFilesResponse);
    });
  }

  public addWatcher(
    showAllFiles: boolean,
    callback: (wsData: LsApiResponse) => void
  ): WatchAborter {
    const watcherId = this.watcherIdCounter;
    this.watcherIdCounter++;
    this.watchers.set(watcherId, { callback, showAllFiles });

    // first watcher, begin fswatch and trigger update
    if (this.watchers.size === 1) {
      this.startWatching();
    } else {
      // send lastest response to newly added watcher
      if (this.lastResponse && this.hiddenLastResponse) {
        callback(showAllFiles ? this.lastResponse : this.hiddenLastResponse);
      }
    }

    const aborter = () => {
      this.watchers.delete(watcherId);
      if (this.watchers.size === 0) {
        this.fileWatcher?.removeAllListeners();
      }
    };
    return aborter;
  }
}
