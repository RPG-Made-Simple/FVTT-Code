import type { Util } from "./util.ts"

declare global {
  interface ModuleConfig {
    "toolbox": { api: {
      Util: typeof Util,
    }}
  }
}
