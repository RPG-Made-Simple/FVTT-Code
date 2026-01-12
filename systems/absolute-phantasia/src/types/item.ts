interface WeaponDataSourceData {
  damage: number;
  attackSpeed: number;
}

interface WeaponDataSource {
  weapon: WeaponDataSourceData;
}

interface ArmorDataSourceData {
  defense: number;
  weight: number;
}

interface ArmorDataSource {
  armor: ArmorDataSourceData;
}

type MyItemDataSource = WeaponDataSource | ArmorDataSource;

interface WeaponDataPropertiesData extends WeaponDataSourceData {

}

interface WeaponDataProperties {
  weapon: WeaponDataPropertiesData;
}

interface ArmorDataPropertiesData extends ArmorDataSourceData {

}

interface ArmorDataProperties {
  armor: ArmorDataPropertiesData;
}

type MyItemDataProperties = WeaponDataProperties | ArmorDataProperties;
