import { FoundryFileSystem, FutureProof, Misc, Module, Permission, SocketManager } from "@rpgmadesimple/utils";
import type { ModuleState } from "@rpgmadesimple/utils/src/module.ts";

export class Toolbox {
  static SocketManager = new SocketManager();

  /** Modules that will be showcased in a fancy way */
  private static MODULES_TO_SHOWCASE: string[] = [];

  /**
  * Get the showcased modules.
  * @returns Array containing the modules that got showcased.
  */
  static getShowcasedModules(): string[] {
    return Toolbox.MODULES_TO_SHOWCASE;
  }

  /**
  * Registers the passed module to be showcased in a fancy way at the log
  * output.
  * @param moduleId Id of the module that will be showcased.
  */
  static showcaseModule(moduleId: string) {
    const schema = {
      moduleId: 'string',
    };

    this.validate({ moduleId }, schema);

    Toolbox.MODULES_TO_SHOWCASE.push(moduleId);
  }

  /**
  * Checks if a path exists inside of Foundry data folders.
  * @param path Where the target should be at.
  * @returns `true` on success and `false` on failure.
  */
  static async exists(path: string): Promise<boolean> {
    return FoundryFileSystem.exists(path);
  }

  /**
  * Stores the file somewhere in Foundry data folders
  * @param path Where the data will be saved.
  * @param data The object containing the data.
  * @returns `true` on success and `false` on failure.
  */
  static async save(path: string, data: any): Promise<boolean> {
    return FoundryFileSystem.save(path, data);
  }

  /**
  * Loads the file from the specified path in Foundry data folders.
  * @param path Where the data will be loaded from.
  * @returns The loaded data, if found.
  */
  static async load(path: string): Promise<unknown> {
    return FoundryFileSystem.load(path);
  }

  /**
  * Ensures the existence of a file or directory at the specified path.
  * @param path Where the operation will be performed.
  * @param data The object containing the default data if the path doens't
  * exist.
  * @returns `true` if it exists or was created, otherwise `false`.
  */
  static async ensure(path: string, data?: any): Promise<boolean> {
    return FoundryFileSystem.ensure(path, data);
  }

  /**
  * Validates an object against a schema.
  * @param obj The object to validate.
  * @param schema A record where keys are property names and values are
  * expected types.
  * @throws An error if validation fails.
  */
  static validate(
    obj: Record<string, unknown>,
    schema: Record<string, string | string[]>,
  ) {
    Misc.validate(obj, schema);
  }

  /**
  * Wrapper to get game.
  * @returns The game instance.
  * @throws An error if the game is not yet initialized.
  */
  static getGame(): Game {
    return FutureProof.getGame();
  }

  /**
  * A helper that receives optional implementations for different FoundryVTT
  * versions and handle the switch between implementations.
  * @param switchSchema `object` containing the version => callback schema.
  * @param args The arguments that will be passed to the given callbacks.
  * @returns The same type for all the implementations.
  * @throws If there is no valid implementation for the current Foundry version.
  */
  static versionSwitchBehavior<T>(switchSchema: {
    v10?: (...args: any[]) => T,
    v11?: (...args: any[]) => T,
    v12?: (...args: any[]) => T,
    v13?: (...args: any[]) => T,
  }, ...args: any[]): T | void {
    return Misc.versionSwitchBehavior(switchSchema, args);
  }

  /**
  * Check a module state.
  * @param moduleId The module that will be checked.
  * @returns The module state.
  */
  static checkModuleState(moduleId: string): ModuleState {
    return Module.checkModuleState(moduleId);
  }

  /**
  * Checks if a given user has the passed permissions.
  * @param permissions `string` or `string[]` containing the permissions.
  * @param userId The user being checked. If undefined, refers to current user.
  * @returns `true` if the user has all the passed permissions, otherwise false.
  */
  static hasPermissions(permissions: string | string[], userId?: string): boolean {
    return Permission.hasPermissions(permissions, userId);
  }

  /**
  * Get all users that have the given permissions.
  * @param permissions `string` or `string[]` containing the permissions.
  * @returns `string[]` containing the ids of the found users.
  */
  static allWithPermissions(permissions: string | string[]): string[] {
    return Permission.allWithPermissions(permissions);
  }

  /**
  * Get the first found user that has the given permissions.
  * @param permissions `string` or `string[]` containing the permissions.
  * @returns `string` containing the userId or `undefined` if none is found.
  */
  static firstWithPermissions(permissions: string | string[]): string | undefined {
    return Permission.firstWithPermissions(permissions);
  }

  /**
  * Checks if a document can be edited by the given user.
  * @param document The document being tested.
  * @param userId `string` containing the userId. If null, refers to current
  * user.
  * @returns `true` if the user has all the given permissions, otherwise false.
  */
  static hasPermissionToEdit(document: any, userId?: string): boolean {
    return Permission.hasPermissionToEdit(document, userId);
  }

  /**
  * Get the first found user that can edit the given document.
  * @param document The document being tested.
  * @returns `string` containing the userId or `undefined` if none is found.
  */
  static firstHasPermissionToEdit(document: any): string | undefined {
    return Permission.firstHasPermissionToEdit(document);
  }
}
