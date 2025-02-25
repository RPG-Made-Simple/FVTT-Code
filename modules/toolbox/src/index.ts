import { Constants as DebuggerConstants } from "@rpgmadesimple/debugger/src/constants.ts";
import { Constants } from "./constants.ts";
import { Util } from "./util.ts";
import { prepareForAPI } from "../../../packages/utils/src/misc.ts";

Hooks.once('debugger.ready', () => {
  // Register a debugger
  let Debugger = game.modules?.get('debugger').api;
  if (Debugger !== undefined) {
    Constants.d = new Debugger(Constants.id, Constants.name, true, false);
  }

  prepareForAPI(Constants.id, {
    Utils: Util,
  })

  // To maintain some sort of order based on importance, the showcases are done
  // here. Also, since Debugger is a hard requirement, and Toolbox gets ready
  // after it, we must showcase Debugger here too.
  Util.addModuleToShowcase(DebuggerConstants.id);
  Util.addModuleToShowcase(Constants.id);

  Hooks.call('toolbox.ready');

  Constants.d.info('Ready!');
  Constants.d.info('Library by 🐲 RPG Made Simple');

  Util.showcaseModules();
});
