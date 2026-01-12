import type { AbsolutePhantasiaActor } from "./documents/actor";

interface CharacterSourceData {
  resources: {
    health: { value: number; max: number };
    power: { value: number; max: number };
  };
  attributes: {
    strength: number;
    agility: number;
    intellect: number;
  };
  biography: string;
}

interface CharacterDerivedData extends CharacterSourceData {
}

declare module "fvtt-types/configuration" {
  interface SourceConfig {
    Actor: {
      character: CharacterSourceData;
    };
  }

  interface DataConfig {
    Actor: {
      character: CharacterDerivedData;
    };
  }

  interface DocumentClassConfig {
    Actor: typeof AbsolutePhantasiaActor;
  }
}

interface WeaponSourceData {
  damage: number;
  range: number;
}

interface ArmorSourceData {
  defense: number;
  weight: number;
}

declare module "fvtt-types/configuration" {
  interface SourceConfig {
    Actor: {
      character: CharacterSourceData;
    };
    Item: {
      weapon: WeaponSourceData;
      armor: ArmorSourceData;
    };
  }

  interface DataConfig {
    Actor: {
      character: CharacterDerivedData;
    };
    Item: {
      weapon: WeaponSourceData;
      armor: ArmorSourceData;
    };
  }

  interface DocumentClassConfig {
    Actor: typeof AbsolutePhantasiaActor;
  }
}


export {};
