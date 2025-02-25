import { checkModuleState, ModuleState } from "../../../packages/utils/src/module.ts";

export class Util {
  private static data: {
    showcaseModules: Array<string>,
  } = {
    showcaseModules: [],
  };

  /**
   * Will log the passed module in a fancy way.
   * It only works with loaded modules.
   * @param moduleId the module that will be logged.
   * @param name an optional name to be showcased instead of the default one.
   */
  static addModuleToShowcase(moduleId: string, name?: string): void {
    switch (checkModuleState(moduleId)) {
      case ModuleState.Loaded:
        if (name == undefined) {
          const title = game.modules?.get(moduleId).title;
          if (title != undefined) {
            Util.data.showcaseModules.push(title);
          }
        } else {
          Util.data.showcaseModules.push(name);
        }
        break;

      default:
        break;
    }
  }

  /**
   * Showcase the modules that asked for it.
   */
  static showcaseModules(): void {
    for (const module of Util.data.showcaseModules) {
      // Does a fancy showcase of the modules
      console.log(`%c${module}`,
        `
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
        14px 14px 0 rgb(0,136,255)
        `
      );
    }
  }
}
