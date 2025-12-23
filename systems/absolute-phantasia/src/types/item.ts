interface WeaponDataSourceData {
  damage: number;
  attackSpeed: number;
}

interface WeaponDataSource {
  type: "weapon";
  system: WeaponDataSourceData;
}

interface ArmorDataSourceData {
  defense: number;
  weight: number;
}

interface ArmorDataSource {
  type: "armor";
  system: ArmorDataSourceData;
}

type MyItemDataSource = WeaponDataSource | ArmorDataSource;

interface WeaponDataPropertiesData extends WeaponDataSourceData {

}

interface WeaponDataProperties {
  type: "weapon";
  system: WeaponDataPropertiesData;
}

interface ArmorDataPropertiesData extends ArmorDataSourceData {

}

interface ArmorDataProperties {
  type: "armor";
  system: ArmorDataPropertiesData;
}

type MyItemDataProperties = WeaponDataProperties | ArmorDataProperties;

declare global {
  interface SourceConfig {
    Item: MyItemDataSource;
  }
  interface DataConfig {
    Item: MyItemDataProperties;
  }
}

export {};
