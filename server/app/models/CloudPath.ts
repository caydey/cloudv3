import path from "path";

import { DATA_ROOT } from "../config";

class CloudPath {
  private _system: string;
  private _virtual: string;

  get system(): string {
    return this._system;
  }
  get virtual(): string {
    return this._virtual;
  }

  private constructor(givenPath: string, trustedPath?: boolean) {
    if (trustedPath === true) {
      this._system = givenPath;
      this._virtual = givenPath.replace(DATA_ROOT, "");
    } else {
      const sterilePath = path.join("/", givenPath);
      this._virtual = sterilePath;
      this._system = path.join(DATA_ROOT, sterilePath);
    }
  }

  public static Create(givenPath: string): CloudPath {
    return new CloudPath(givenPath);
  }

  public static CreateTrustedPath(path: string): CloudPath {
    return new CloudPath(path, true);
  }
}

export default CloudPath;
