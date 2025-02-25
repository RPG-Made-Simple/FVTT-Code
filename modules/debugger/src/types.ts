import type { Debugger } from "./debugger.ts"

declare global {
  interface ModuleConfig {
    "debugger": { api: typeof Debugger }
  }
}

export {}
