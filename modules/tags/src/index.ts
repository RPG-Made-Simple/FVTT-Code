import { Constants } from "./constants";
import { requireDebugger, requireToolbox } from "./imports"

// @ts-ignore
Hooks.once("toolbox.ready", () => {
  const debuggerApi = requireDebugger();
  Constants.d = new debuggerApi(Constants.id, Constants.nameFlat, true, false);
  Constants.t = requireToolbox();

  Constants.d.info(`Module Information:
    Version ${game.modules?.get(Constants.id)?.version}
    Library by 🐲 RPG Made Simple`);

  Constants.t.showcaseModule(Constants.nameFlat);

  // @ts-ignore
  Hooks.call(`${Constants.id}.ready`);

  Constants.d.info("Ready!");
})
