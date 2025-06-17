import { getGame } from "@rpgmadesimple/utils/src/misc.ts";

interface DebuggerModule extends Module {
  api?: typeof Debugger,
}

interface ToolboxModule extends Module {
  api?: Toolbox,
}

function requireDebugger(): typeof Debugger {
  const game = getGame();
  const debuggerModule = game.modules.get('debugger') as DebuggerModule | undefined;

  if (!debuggerModule || !debuggerModule.active) {
    throw new Error('Debugger module is not installed or not active');
  }

  const debuggerAPI = debuggerModule.api;
  if (!debuggerAPI) {
    throw new Error('Debugger module does not provide an API');
  }

  return debuggerAPI;
}

function requireToolbox(): Toolbox {
  const game = getGame();
  const toolboxModule = game.modules.get('toolbox') as ToolboxModule | undefined;

  if (!toolboxModule || !toolboxModule.active) {
    throw new Error('Toolbox module is not installed or not active');
  }

  const toolboxAPI = toolboxModule.api;
  if (!toolboxAPI) {
    throw new Error('Toolbox module does not provide an API');
  }

  return toolboxAPI;
}

export { requireDebugger, requireToolbox }
