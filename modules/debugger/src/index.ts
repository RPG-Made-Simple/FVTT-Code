import { prepareForAPI } from "@rpgmadesimple/utils/src/misc.ts";
import { Constants } from "./constants.ts";
import { Debugger } from "./debugger.ts";

Hooks.once('ready', () => {
  const dbg = new Debugger(Constants.id, Constants.name, true, false);
  dbg.info('Ready!');
  dbg.info('Library by 🐲 RPG Made Simple');

  prepareForAPI(Constants.id, Debugger);

  Hooks.call('debugger.ready');
});
