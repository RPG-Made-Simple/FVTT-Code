import { getGame } from "@rpgmadesimple/utils/src/futureProof.ts";

interface DebuggerModule extends foundry.packages.Module {
  api?: typeof Debugger,
}

function requireDebugger(): typeof Debugger {
  const game = getGame();
  const debuggerModule = game.modules.get('debugger') as DebuggerModule | undefined;

  if (!debuggerModule || !debuggerModule.active) {
    throw new Error('Debugger module is not installed or not active');
  }

  const debuggerApi = debuggerModule.api;
  if (!debuggerApi) {
    throw new Error('Debugger module does not provide an API');
  }

  return debuggerApi;
}

export { requireDebugger }
