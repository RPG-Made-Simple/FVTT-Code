import { prepareForAPI } from "@rpgmadesimple/utils/src/misc";
import { Bifrost as BifrostClass, BifrostHooks } from "./bifrost";
import { Constants } from "./constants";
import { requireDebugger, requireToolbox } from "./imports"
import type { Bridge } from "./bridge/bridge";

declare global {
  type Bifrost = typeof Bifrost;
  const Bifrost: typeof BifrostClass;
  type Bridge = typeof Bridge;
}

// @ts-ignore
Hooks.once("toolbox.ready", () => {
  const debuggerApi = requireDebugger();
  Constants.d = new debuggerApi(Constants.id, Constants.nameFlat, true, false);
  Constants.t = requireToolbox();

  // @ts-ignore
  Hooks.call(`${Constants.id}.${BifrostHooks.INITIALIZING}`);

  switch (Constants.t.getGame().system.id) {
    case "dnd5e":
      // Constants.currentBridge = new DnD5eBridge();
      break;

    default:
      break;
  }

  prepareForAPI(Constants.id, BifrostClass);

  Constants.d.info(`Module information:
    Version ${Constants.t.getGame().modules.get(Constants.id)?.version}
    Library by 🐲 RPG Made Simple`);

  Constants.t.showcaseModule(Constants.nameFlat);

  // @ts-ignore
  Hooks.call(`${Constants.id}.${BifrostHooks.READY}`);

  Constants.d.info("ready!");
})
