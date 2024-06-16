// wait TRIGGER_DELAY to send response, because changing a dir will result

import { FSWatcher } from "fs-extra";
import fs from "fs";
import CloudPath from "../models/CloudPath";
import { LsApiResponse, lsApi, validateExplorePath } from "../api/user/ls";
import { WatchAborter } from "./WatchAborter";
import { HIDDEN_FILES_CHARACTER } from "../config";

// in fs.watch being called up to 3 times in the span of 10ms
const TRIGGER_DELAY = 100;

export interface Watcher {
  showAllFiles: boolean;
  callback: (wsData: LsApiResponse) => void;
}

export class DirectoryWatcher {
  private watchers: Map<number, Watcher> = new Map();
  private fileWatcher?: FSWatcher;
  private lastResponse?: LsApiResponse;
  private hiddenLastResponse?: LsApiResponse;
  private id = 0;
  private cloudPath: CloudPath;

  private updateTimeout?: NodeJS.Timeout;

  constructor(cloudPath: CloudPath) {
    this.cloudPath = cloudPath;
  }

  private startWatching() {
    validateExplorePath(this.cloudPath, (errMessage) => {
      if (errMessage) {
        return this.broadcastResponse({
          success: false,
          message: errMessage,
        });
      }

      this.triggerUpdate();

      let timer: NodeJS.Timeout;
      this.fileWatcher = fs.watch(this.cloudPath.system);
      this.fileWatcher.addListener("change", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.triggerUpdate();
        }, TRIGGER_DELAY);
      });
    });
  }

  private abort() {
    this.fileWatcher?.removeAllListeners();
  }

  private triggerUpdate() {
    if (this.updateTimeout) clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(this.update.bind(this), 750);
  }

  private update() {
    lsApi(this.cloudPath, (response) => {
      // exploreApi returned error, abort all future updates
      if (!response.success) {
        this.abort();
      }
      this.broadcastResponse(response);
    });
  }

  private broadcastResponse(response: LsApiResponse) {
    // create response clone with the dot files hidden
    const clonedData = Object.assign({}, response.data);
    const hidFilesResponse = { success: response.success, data: clonedData };
    if (hidFilesResponse.success && hidFilesResponse.data.children) {
      hidFilesResponse.data.children = [];
      hidFilesResponse.data.size = 0; // hide size that the dot files take up
      response.data?.children?.forEach((child) => {
        if (!child.name.startsWith(HIDDEN_FILES_CHARACTER)) {
          // not hidden file
          hidFilesResponse.data?.children?.push(child);
          hidFilesResponse.data.size += child.size;
        }
      });
    }
    // update last responses
    this.hiddenLastResponse = hidFilesResponse;
    this.lastResponse = response;

    // broadcast response to all watchers
    this.watchers.forEach(({ callback, showAllFiles }) => {
      callback(showAllFiles ? response : hidFilesResponse);
    });
  }

  public addWatcher(
    showAllFiles: boolean,
    callback: (wsData: LsApiResponse) => void
  ): WatchAborter {
    const watcherId = this.id;
    this.id++;
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
        this.abort();
      }
    };
    return aborter;
  }
}
