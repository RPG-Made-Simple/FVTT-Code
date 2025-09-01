import { getGame } from "./futureProof.ts";

function isValidPermission(permission: string): permission is keyof typeof CONST.USER_PERMISSIONS {
  return Object.keys(CONST.USER_PERMISSIONS).includes(permission);
}

// TODO: remove this later...
type UserType = {
  hasPermission: (permission: keyof typeof CONST.USER_PERMISSIONS) => boolean,
} | undefined;

/**
 * Checks if a given user has the passed permissions.
 * @param permissions string or string[] containing the permissions.
 * @param userId the user being checkd. If null, refers to current user.
 * @returns returns true if the user has all the passed permissions.
 */
export function hasPermissions(permissions: string | string[], userId?: string): boolean {
  const g = getGame();

  // Check if passed permissions are valid
  const checkedPermissions = (Array.isArray(permissions) ? permissions : [permissions]).map(p => {
    if (!isValidPermission(p)) throw new Error(`Invalid permission: ${p}`);
    return p as keyof typeof CONST.USER_PERMISSIONS;
  });

  // Get user
  const user: UserType = userId
    ? g.users?.get(userId) as unknown as UserType
    : g.user as unknown as UserType;
  if (!user) return userId !== undefined ? false : true;

  // Check if user has all the passed permissions
  return checkedPermissions.every(p => user.hasPermission(p));
}

/**
 * Get all the users that have the given permissions.
 * @param permissions string or string[] containing the permissions.
 * @returns string[] containing the found users.
 */
export function allWithPermissions(permissions: string | string[]): string[] {
  const g = getGame();

  let userIds: string[] = [];
  for (const user of game.users!) {
    if (hasPermissions(permissions, user.id)) {
      userIds.push(user.id);
    }
  }

  return userIds;
}

/**
 * Get the first found user with the given permissions.
 * @param permissions string or string[] cotaining the permissions.
 * @returns userId or undefined if none is found.
 */
export function firstWithPermissions(permissions: string | string[]): string | undefined {
  const g = getGame();

  if (hasPermissions(permissions, game.user!.id)) {
    return game.user!.id;
  }

  for (const user of game.users!) {
    if (hasPermissions(permissions, user.id)) {
      return user.id;
    }
  }
}

/**
 * Checks if a document can be edited by the given user.
 * @param document the document being tested.
 * @param userId the user being checked. If null, refers to current user.
 * @returns true if the user has all the passed permissions.
 */
export function hasPermissionToEdit(document: any, userId?: string): boolean {
  const g = getGame();

  // Get user
  const user: UserType = userId
    ? g.users?.get(userId) as unknown as UserType
    : g.user as unknown as UserType;
  if (!user) return userId !== undefined ? false : true;

  // Check user permissions on the document
  return document.testUserPermission(user, 'OWNER');
}

/**
 * Returns the first found user that can edit the passed document.
 * @param document the document being tested.
 * @returns userId or undefined if none is found.
 */
export function firstHasPermissionToEdit(document: any): string | undefined {
  const g = getGame();

  if (hasPermissionToEdit(game.user!.id)) {
    return game.user!.id;
  }

  for (const user of g.users!) {
    if (hasPermissionToEdit(document, user.id)) {
      return user.id;
    }
  }
}
