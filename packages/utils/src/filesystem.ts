import { validate } from "./misc.ts";

/**
 * All the possible types of a path.
 */
enum PathType {
  Directory,
  Json,
  InvalidFile,
}

/**
 * Schema for validating a string path.
 */
const PathSchema = { type: 'string' };

/**
 * Extracts meta information required to properly use the path.
 * @param path target path that can have meta extracted from.
 * @returns meta data about the path.
 */
function extractMetaFromPath(path: string) {
  const nameIndex = path.lastIndexOf("/") + 1;
  const data = {
    fileName: path.slice(nameIndex),
    pathName: path.slice(0, nameIndex - 1),
  };

  // Check if the path refers to a file
  if (data.fileName.includes(".")) {
    // Check if the file is a JSON
    if (data.fileName.includes(".json")) {
      return {
        ...data,
        pathType: PathType.Json,
      };
    } else {
      return {
        ...data,
        pathType: PathType.InvalidFile,
      };
    }
  } else {
    return {
      ...data,
      pathType: PathType.Directory,
    };
  }
}

/**
 * Checks if a path exists inside of Foundry data folders.
 * @param path where the target should be at.
 * @returns `true` on success and `false` on failure.
 */
export async function exists(path: string): Promise<boolean> {
  validate({ path }, { path: PathSchema.type });
  const meta = extractMetaFromPath(path);

  try {
    switch (meta.pathType) {
      case PathType.Json: {
        const folders = await FilePicker.browse("data", meta.pathName);
        return folders.files.includes(path.slice(2));
      }
      case PathType.Directory: {
        const folders = await FilePicker.browse("data", meta.pathName);
        return folders.files.includes(path.slice(2));
      }
      case PathType.InvalidFile: {
        console.error("Only JSON files are supported");
        return false;
      }
    }
  } catch (error) {
    console.error(`Failed to check if "${path}" exists:`, error);
    return false;
  }
}

/**
 * Stores the file somewhere in Foundry data folders.
 * @param path where the data will be saved.
 * @param data the object containing the data.
 * @returns `true` on success and `false` on failure.
 */
export async function save(path: string, data: any): Promise<boolean> {
  validate({ path }, { path: PathSchema.type });

  if (foundry.utils.isEmpty(data)) {
    console.error('"data" is missing');
    return false;
  }

  const meta = extractMetaFromPath(path);

  if (meta.pathType === PathType.Json) {
    try {
      const newFile = new File([JSON.stringify(data)], meta.fileName, { type: "application/json" });
      await FilePicker.upload("data", meta.pathName, newFile, {}, { notify: false });
      return true;
    } catch (error) {
      console.error(`Failed to save "${path}":`, error);
      return false;
    }
  } else {
    console.error("Can only save JSON files");
    return false;
  }
}

/**
 * Loads the file from the specified path in Foundry data folders.
 * @param path where the data will be loaded from.
 * @returns the loaded data, if found.
 */
export async function load(path: string): Promise<unknown> {
  validate({ path }, { path: PathSchema.type });

  try {
    const result = await foundry.utils.fetchJsonWithTimeout(path);
    return result;
  } catch (error) {
    console.error(`Failed to load "${path}":`, error);
    return;
  }
}

/**
 * Ensures the existence of a file or directory at the specified path.
 * @param path where the operation will be performed.
 * @param data the object containing the default data if the path doesn't exist.
 * @returns `true` if it exists or was created, otherwise `false`.
 */
export async function ensure(path: string, data?: any): Promise<boolean> {
  validate({ path }, { path: PathSchema.type });

  const meta = extractMetaFromPath(path);

  // Check if file already exists
  if (await exists(path)) {
    return true;
  }

  switch (meta.pathType) {
    case PathType.Json: {
      if (foundry.utils.isEmpty(data)) {
        console.error('"data" is missing');
        return true;
      }
      return await save(path, data);
    }
    case PathType.Directory: {
      try {
        await FilePicker.createDirectory("data", path);
        return true;
      } catch (error) {
        console.error(`Failed to ensure the existence of "${path}":`, error);
        return false;
      }
    }
    case PathType.InvalidFile: {
      console.error("Only JSON files are supported");
      return false;
    }
  }
}
