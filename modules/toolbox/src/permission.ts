import { Misc } from "../../../packages/utils/src/index.ts";

const OptionalStringSchema = { type: ['string', 'null', 'undefined'] };
const PermissionsSchema = { type: ['string', 'array'] };

export class Permission {
  /**
   * Checks if a given user has the passed permissions.
   * @param permissions string or string[] containing the permissions.
   * @param userId the user being checkd. If null, refers to current user.
   * @returns returns true if the user has all the passed permissions.
   */
  static hasPermissions(permissions: string | string[], userId?: string): boolean {
    Misc.validate(
      { permissions, userId },
      {
        permissions: PermissionsSchema.type,
        userId: OptionalStringSchema.type,
      }
    );

    return Permission.hasPermissions(permissions, userId);
  }

  /**
   * Get all the users that have the given permissions.
   * @param permissions string or string[] containing the permissions.
   * @returns string[] containing the found users.
   */
  static allWithPermissions(permissions: string | string[]): string[] {
    Misc.validate(
      { permissions },
      {
        permissions: PermissionsSchema.type,
      }
    );

    return Permission.allWithPermissions(permissions);
  }

  /**
   * Get the first found user with the given permissions.
   * @param permissions string or string[] cotaining the permissions.
   * @returns userId or undefined if none is found.
   */
  static firstWithPermissions(permissions: string | string[]): string | undefined {
    Misc.validate(
      { permissions },
      {
        permissions: PermissionsSchema.type,
      }
    );

    return Permission.firstWithPermissions(permissions);
  }

  /**
   * Checks if a document can be edited by the given user.
   * @param document the document being tested.
   * @param userId the user being checked. If null, refers to current user.
   * @returns true if the user has all the passed permissions.
   */
  static hasPermissionToEdit(document: any, userId?: string): boolean {
    Misc.validate(
      { userId },
      {
        userId: OptionalStringSchema.type,
      }
    );

    return Permission.hasPermissionToEdit(document, userId);
  }
}
