import { prepareForAPI } from "@rpgmadesimple/utils/src/misc.ts";
import { Constants } from "./constants.ts";
import { Debugger } from "./debugger.ts";

Hooks.once('init', () => {
  prepareForAPI(Constants.nameFlat, Debugger);
});

Hooks.once('ready', () => {
  const dbg = new Debugger(Constants.nameFlat, Constants.name, true, false);
  dbg.info('Ready!');
  dbg.info('Library by 🐲 RPG Made Simple')

  Hooks.call('debugger.ready');
});
