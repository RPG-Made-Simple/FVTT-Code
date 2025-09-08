import { Bridge } from "@rpgmadesimple/bifrost/dist/types/bridge/bridge";
import type { BridgeMeta } from "@rpgmadesimple/bifrost/dist/types/bridge/bridgeMeta";
import type { ItemMeta } from "@rpgmadesimple/bifrost/dist/types/system/itemMeta";
import type { SystemMeta } from "@rpgmadesimple/bifrost/dist/types/system/systemMeta";

export class CoC7Bridge extends Bridge {
  override get systemMeta(): SystemMeta {
    return {
      hooks: {
        item: 
      }
    }
  }

  override get bridgeMeta(): BridgeMeta {
    throw new Error("Method not implemented.");
  }
  override getItemMeta(item: foundry.documents.Item): ItemMeta {
    throw new Error("Method not implemented.");
  }
  
}
