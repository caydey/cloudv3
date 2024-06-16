import CloudPath from "./CloudPath.js";
import { WatchAborter } from "../socket/WatchAborter.js";
import { DirectoryWatcher } from "../socket/DirectoryWatcher.js";
import { LsApiResponse } from "../api/user/ls.js";

export class ExplorerHandler {
  private directoryWatchers: Record<string, DirectoryWatcher>;

  constructor() {
    this.directoryWatchers = {};
  }

  addExplorer(
    cloudPath: CloudPath,
    showAllFiles: boolean,
    callback: (wsData: LsApiResponse) => void
  ): WatchAborter {
    let directoryWatcher = this.directoryWatchers[cloudPath.system];
    // create new filewatcher for directory if we dont already have one
    if (!directoryWatcher) {
      directoryWatcher = new DirectoryWatcher(cloudPath);
      this.directoryWatchers[cloudPath.system] = directoryWatcher;
    }

    const aborter = directoryWatcher.addWatcher(showAllFiles, callback);
    return aborter;
  }
}
