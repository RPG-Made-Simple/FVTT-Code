/**
 * Validates the type of a value.
 * @param value The value to validate.
 * @param type The expected type (e.g., 'string', 'boolean', 'object').
 * @returns `true` if the value matches the expected type, otherwise `false`.
 */
function validateType(value: unknown, type: string): boolean {
  if (type === 'string') return typeof value === 'string';
  if (type === 'boolean') return typeof value === 'boolean';
  if (type === 'object') return typeof value === 'object' && value !== null;
  if (type === 'number') return typeof value === 'number';
  if (type === 'array') return Array.isArray(value);
  if (type === 'undefined') return value === undefined;
  if (type === 'function') return typeof value === 'function';
  if (type === 'any') return true;
  return false;
}

/**
 * Validates an object against a schema.
 * @param obj The object to validate.
 * @param schema A record where keys are property names and values are expected types.
 * @throws An error if validation fails.
 */
export function validate(
  obj: Record<string, unknown>,
  schema: Record<string, string | string[]>
): void {
  for (const key in schema) {
    const expectedType = schema[key];

    const types = Array.isArray(expectedType) ? expectedType : [expectedType];
    const isValid = types.some((type) => validateType(obj[key], type ?? 'undefined'));

    if (!isValid) {
      throw new TypeError(
        `Invalid type for property "${key}". Expected ${types.join(" | ")}, got ${typeof obj[key]}.`
      );
    }
  }
}

/**
 * Stringifies the arguments.
 * @returns Arguments properly stringified.
 */
export function argStringfy(...params: Array<unknown>): string {
  let result = "";

  for (let i = 0; i < params.length; i++) {
    let arg = params[i];

    if (typeof arg === "object" && arg !== null) {
      try {
        arg = `\n${JSON.stringify(arg)}`;
      } catch {
        arg = "\n[Object]";
      }
    } else {
      arg = String(arg);
    }

    result += arg;

    if (i < params.length - 1) {
      result += " ";
    } else {
      result += "\n";
    }
  }

  return result;
}

/**
 * Prepares everything to attach the API into a module.
 * @param moduleId The module that will contain the API.
 * @param register What will be accessible at the API.
 */
export function prepareForAPI(moduleId: string, register: unknown): void {
  // Validate the inputs
  const schema = {
    moduleId: 'string',
    register: 'any',
  };

  validate({ moduleId, register }, schema);

  const module = game.modules?.get(moduleId);
  if (module !== undefined) {
    // @ts-ignore
    module['api'] = register;
  }
}

/**
 * Wrapper to get game.
 * @returns The game instance.
 * @throws If the game is not yet initialized.
 */
export function getGame(): Game {
  if(!(game instanceof Game)) {
    throw new Error('game is not initialized yet!');
  }
  return game;
}

/**
 * A helper that receives optional implementations for different FoundryVTT
 * versions and handle the switch between implementations.
 * @param switchSchema `object` containing the version => callback schema.
 * @param args The arguments that will be passed to the given callbacks.
 * @returns The same type for all the implementations.
 * @throws If there is no valid implementation for the current Foundry version.
 */
export function versionSwitchBehavior<T>(switchSchema : {
  v13?: (...args: any[]) => T,
}, ...args: any[]): T | void {
  switch (getGame().release.generation) {
    case 13: if (switchSchema.v13) { return switchSchema.v13(args) } break;
    default: throw new Error('could not find a valid implementation for this Foundry version');
  }
}
