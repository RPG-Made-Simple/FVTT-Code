import { getGame } from "@rpgmadesimple/utils/src/futureProof.ts";

interface DebuggerModule extends Module {
  api?: typeof Debugger,
}

interface ToolboxModule extends Module {
  api?: typeof Toolbox,
}

export function requireDebugger(): typeof Debugger {
  const game = getGame();
  const debuggerModule = game.modules.get("debugger") as DebuggerModule | undefined;

  if (!debuggerModule || !debuggerModule.active) {
    throw new Error("Debugger module is not installed or not active");
  }

  const debuggerApi = debuggerModule.api;
  if (!debuggerApi) {
    throw new Error("Debugger module does not provide an API");
  }

  return debuggerApi;
}

export function requireToolbox(): typeof Toolbox {
  const game = getGame();
  const toolboxModule = game.modules.get("toolbox") as ToolboxModule | undefined;

  if (!toolboxModule || !toolboxModule.active) {
    throw new Error("Toolbox module is not installed or not active");
  }

  const toolboxApi = toolboxModule.api;
  if (!toolboxApi) {
    throw new Error("Toolbox module does not provide an API");
  }

  return toolboxApi;
}
