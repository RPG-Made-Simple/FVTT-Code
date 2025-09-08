import type { TriggerType } from "./triggerType";

export interface ItemTrigger {
  type: TriggerType.ITEM,
  item?: foundry.documents.Item,
  actor?: foundry.documents.Actor,
  token?: foundry.canvas.placeables.Token,
  targets?: foundry.canvas.placeables.Token[],
  hitTargets?: foundry.canvas.placeables.Token[],
  dice?: {
    roll: number,
    total: number,
    critical?: boolean,
    fumble?: boolean,
  }
}
