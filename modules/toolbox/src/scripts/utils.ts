/**
 * All the states a module can be at.
 */
export enum ModuleState {
  Uninstalled,
  Installed,
  Loaded,
}

export class Utils {
  static data: {
    showcaseModules: Array<string>,
  };

  /**
   * Checks if a module is installed and
   */
  static checkModuleState(moduleId: string): ModuleState {
    const module = game.modules?.get(moduleId);

    if (!module) {
      return ModuleState.Uninstalled;
    }

    if (module.active) {
      return ModuleState.Loaded;
    } else {
      return ModuleState.Installed;
    }
  }

  /**
   * Will log the passed module in a fancy way.
   */
  static showcaseModule(moduleId: string): void {
    switch (this.checkModuleState(moduleId)) {
      case ModuleState.Installed:
        Utils.data.showcaseModules.push(moduleId);
        break;

      default:
        break;
    }
  }

  /**
   * Showcase the modules that asked for it.
   */
  static doTheShowcase() {
    for (const module of Utils.data.showcaseModules) {
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
