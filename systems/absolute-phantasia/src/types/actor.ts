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
  character: CharacterDataSourceData;
}

type MyActorDataSource = CharacterDataSource;

interface CharacterDataPropertiesData extends CharacterDataSourceData {

}

interface CharacterDataProperties {
  character: CharacterDataPropertiesData;
}

type MyActorDataProperties = CharacterDataProperties;
