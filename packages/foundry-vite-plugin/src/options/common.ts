export enum ArtifactType {
  SYSTEM = "system",
  MODULE = "module",
}

export interface Compatibility {
  minimum: string;
  maximum?: string;
  verified: string;
}

export interface Author {
  name: string;
  email?: string;
  url?: string;
  discord?: string;
}

export interface Language {
  lang: string;
  name: string;
}

export interface SystemRelationship {
  id: string;
  compatibility?: Compatibility;
}

export interface ModuleRelationship {
  id: string;
  manifest?: string;
  compatibility?: Compatibility;
}

