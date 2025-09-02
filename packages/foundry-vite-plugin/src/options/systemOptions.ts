import { ArtifactType, Author, Compatibility, Language, ModuleRelationship } from "./common";

export interface SystemOptions {
  id: string;
  title: string;
  description: string;
  version: string;
  socket?: boolean;
  initiative: string;
  compatibility: Compatibility;
  relationships: {
    requires?: ModuleRelationship[],
    recommends?: ModuleRelationship[],
  }
  authors: Author[];
  languagePath: string;
  languages: Language[];
  grid: {
    distance: number,
    units: string,
  };
  primaryTokenAttribute: string;
  secondaryTokenAttribute: string;
  repo: string;
}

export interface TypedSystemOptions {
  type: ArtifactType.SYSTEM;
  options: SystemOptions;
}

export function defineSystemOptions(options: SystemOptions): TypedSystemOptions {
  return {
    type: ArtifactType.SYSTEM,
    options,
  }
}
