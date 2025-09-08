import type { ItemMeta } from "../system/itemMeta";
import type { SystemMeta } from "../system/systemMeta";
import type { BridgeMeta } from "./bridgeMeta";
import { BridgeErrorInvalidTarget } from "./errors";

export abstract class Bridge {
  /** Returns the meta information about the system */
  public abstract get systemMeta(): SystemMeta;
  /** Returns the meta information about the bridge */
  public abstract get bridgeMeta(): BridgeMeta;

  public abstract getItemMeta(item: foundry.documents.Item): ItemMeta;

  /**
   * Add items to a target actor.
   * @param targetUuid the target's actor uuid.
   * @param items an array with the items being added.
   * @returns promise containing the added items.
   */
  public async addItems(targetUuid: string, items: foundry.documents.Item[]): Promise<foundry.documents.Item[]> {
    const target = await fromUuid(targetUuid) as Actor;
    if (target) {
      return await target.createEmbeddedDocuments("Item", items);
    } else {
      throw new BridgeErrorInvalidTarget(`could not find a target with the uuid "${targetUuid}"`);
    }
  }

  /**
   * Remove items from a target actor.
   * @param targetUuid the target's actor uuid.
   * @param itemIds an array containing the uuids from the items being removed.
   * @returns promise
   */
  public async removeItems(targetUuid: string, itemIds: string[]) {
    const target = await fromUuid(targetUuid) as Actor;
    if (target) {
      return await target.deleteEmbeddedDocuments("Item", itemIds);
    } else {
      throw new BridgeErrorInvalidTarget(`could not find a target with the uuid "${targetUuid}"`);
    }
  }
}
