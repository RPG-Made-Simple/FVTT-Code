interface CharacterDataSourceData {
  resources: {
    health: { value: number, max: number };
    power: { value: number, max: number };
  };
  attributes: {
    strength: number;
    agility: number;
    intellect: number;
  };
  biography: string;
}

interface CharacterDataSource {
  type: "character";
  system: CharacterDataSourceData;
}

type MyActorDataSource = CharacterDataSource;

interface CharacterDataPropertiesData extends CharacterDataSourceData {

}

interface CharacterDataProperties {
  type: "character",
  system: CharacterDataPropertiesData;
}

type MyActorDataProperties = CharacterDataProperties;

declare global {
  interface SourceConfig {
    Actor: MyActorDataSource;
  }
  interface DataConfig {
    Actor: MyActorDataProperties;
  }
}

export {};
