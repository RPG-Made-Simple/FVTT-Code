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
  schema: Record<string, string | string[]> // Permite tipos múltiplos para cada propriedade.
): void {
  for (const key in schema) {
    const expectedType = schema[key];

    const types = Array.isArray(expectedType) ? expectedType : [expectedType];
    const isValid = types.some((type) => validateType(obj[key], type ?? 'undefined'));

    if (!isValid) {
      throw new Error(
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
 * Prepares everything to attach the `namespace` into the API.
 * @param namespace The name that will be used to access the API methods (must be a string).
 * @param register The object that will be registered under the namespace.
 */
export function prepareForAPI(namespace: string, register: unknown): void {
  // Validate the inputs
  const schema = {
    namespace: 'string',
    register: 'any',
  };

  validate({ namespace, register }, schema);

  // Attach the namespace to the global API object
  let apiRoot = (window as any)["RMS"];
  if (!apiRoot) {
    apiRoot = (window as any)["RMS"] = {};
  }
  apiRoot[namespace] = register;
}
