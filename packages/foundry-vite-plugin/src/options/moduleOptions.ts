import { ArtifactType, Author, Compatibility, Language, ModuleRelationship, SystemRelationship } from "./common";

export interface ModuleOptions {
  id: string;
  title: string;
  description: string;
  version: string;
  library?: boolean;
  socket?: boolean;
  compatibility: Compatibility,
  relationships?: {
    systems?: SystemRelationship[],
    requires?: ModuleRelationship[],
    recommends?: ModuleRelationship[],
  },
  authors: Author[];
  language?: {
    path: string;
    include: Language[],
  };
  templates?: {
    path: string;
    include: string[],
  };
  styles?: {
    path: string,
    include: string[],
  };
  repo: string;
}

export interface TypedModuleOptions {
  type: ArtifactType.MODULE;
  options: ModuleOptions,
}

export function defineModuleOptions(options: ModuleOptions): TypedModuleOptions {
  return {
    type: ArtifactType.MODULE,
    options,
  }
}
