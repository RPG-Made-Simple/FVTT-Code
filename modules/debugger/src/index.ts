import { prepareForAPI } from "@rpgmadesimple/utils/src/misc.ts";
import { Constants } from "./constants.ts";
import { Debugger as DebuggerClass } from "./debugger.ts";

declare global {
  type Debugger = DebuggerClass;
  const Debugger: typeof DebuggerClass;
}

Hooks.once('init', () => {
  prepareForAPI(Constants.id, DebuggerClass);
});

Hooks.once('ready', () => {
  const dbg = new DebuggerClass(Constants.id, Constants.nameFlat, true, false);
  dbg.info('Ready!');
  dbg.info('Library by 🐲 RPG Made Simple')

  Hooks.call('debugger.ready');
});
