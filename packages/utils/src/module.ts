/**
 * All the states a module can be at.
 */
export enum ModuleState {
  Uninstalled,
  Installed,
  Loaded,
}

/**
 * Check a module state.
 * @param moduleId the module that will be checked.
 * @returns the module state.
 */
export function checkModuleState(moduleId: string): ModuleState {
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

