import type { Bridge } from "./bridge/bridge";
import { Constants } from "./constants";

export enum BifrostHooks {
  INITIALIZING = "initializing",
  READY = "ready",
}

export class Bifrost {
  /**
   * Gets the current set bridge.
   * @returns the bridge that is currenlty set.
   */
  public static bridge(): Bridge {
    if (Constants.currentBridge) {
      return Constants.currentBridge;
    } else {
      throw new Error("Bridge not set");
    }
  }
}
