import type { SystemRange } from "./systemRange"

export enum ItemProperty {
  MAGICAL = "magical",
  THROWN = "thrown",
  RETURNS = "returns",
  FINESSE = "finesse",
}

export enum ItemMaterial {
  ADAMANTINE = "adamantine",
  SILVER = "silver",
}

export interface ItemMeta {
  basic: {
    name: string,
    owner?: Actor,
    image?: string,
    ref: foundry.documents.Item,
  },
  extra?: {
    properties?: ItemProperty[],
    materials?: ItemMaterial[],
    physical?: {
      amount: number,
    },
    range?: {
      melee?: {
        min: SystemRange,
        max: SystemRange,
      },
      ranged?: {
        min: SystemRange,
        max: SystemRange,
      },
    },
    ammo?: {
      has?: boolean,
      item?: ItemMeta,
      quantity?: number,
    },
    state?: {
      equipped?: boolean,
    },
  },
}
