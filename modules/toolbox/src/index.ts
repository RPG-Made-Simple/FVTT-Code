import { requireDebugger } from "./imports.ts"
import { prepareForAPI } from "@rpgmadesimple/utils/src/misc.ts"
import { Constants } from "./constants.ts"
import { Toolbox as ToolboxClass } from "./toolbox.ts";

declare global {
  type Toolbox = typeof ToolboxClass;
  const Toolbox: typeof ToolboxClass;
}

// @ts-ignore
Hooks.once('debugger.ready', () => {
  const debuggerAPI = requireDebugger();
  Constants.d = new debuggerAPI(Constants.id, Constants.nameFlat, true, false);

  Constants.d.info('Module Information:');
  Constants.d.info(`Version ${game.modules?.get(Constants.id)?.version}`);
  Constants.d.info('Library by 🐲 RPG Made Simple');

  prepareForAPI(Constants.id, ToolboxClass);

  // To maintain some sort of order based on importance, the showcases are here.
  // Since Debugger is a requirement, and Toolbox gets ready after it, we must
  // showcase Debugger here.
  ToolboxClass.showcaseModule('Debugger');
  ToolboxClass.showcaseModule(Constants.nameFlat);

  // @ts-ignore
  Hooks.call('toolbox.ready');

  Constants.d.info('Ready!');

  // Showcase registered modules
  for (const module of ToolboxClass.getShowcasedModules()) {
    console.log(`%c${module}`, `
      font-weight: bold;
      font-size: 36px;
      color: rgb(255,0,136);
      text-shadow:
      2px 2px 0 rgb(220,19,153),
      4px 4px 0 rgb(173,44,174),
      6px 6px 0 rgb(146,58,187),
      8px 8px 0 rgb(115,75,201),
      10px 10px 0 rgb(70,99,222),
      12px 12px 0 rgb(37,117,238),
      14px 14px 0 rgb(0,136,255)`);
  }
});
