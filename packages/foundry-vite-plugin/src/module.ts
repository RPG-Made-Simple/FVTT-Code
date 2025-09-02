import { ModuleOptions } from "./options/moduleOptions";

import { promises as fs } from 'fs';
import path from 'path';
import { copyFolder, copyLangFiles, deleteFolderRecursive, generateDeclarations } from "./utils";

export async function generateModuleBundle(options: ModuleOptions) {
  console.log("generating module.json...");

  const languageData = options.languages.map((lang) => ({
    lang: lang.lang,
    name: lang.name,
    path: `./lang/${lang.lang}.json`,
  }));

  const structuredData = {
    id: options.id,
    title: options.title,
    description: options.description,
    version: options.version,
    library: options.library,
    socket: options.socket,
    authors: options.authors,
    languages: languageData,
    compatibility: options.compatibility,
    relationships: options.relationships,
    license: "./LICENSE.md",
    url: options.repo,
    bugs: `${options.repo}/issues`,
    manifest: `${options.repo}/releases/latest/download/${options.id}.json`,
    download: `${options.repo}/releases/latest/download/${options.id}.zip`,
    readme: `${options.repo}/blob/main/modules/${options.id}/README.md`,
    changelog: `${options.repo}/blob/main/modules/${options.id}/CHANGELOG.md`,
    esmodules: ["./module.js"],
  };

  const outDir = path.resolve(process.cwd(), "dist");
  const outputPath = path.join(outDir, "module.json");

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(structuredData, null, 2),
    "utf-8",
  );

  console.log("module.json generated");

  await copyLangFiles(options.languagePath);

  generateDeclarations();
}

export async function writeModuleBundle(moduleId: string) {
  const outDir = path.resolve(process.cwd(), "dist");
  const rootDit = path.resolve(process.cwd(), "../../");
  const targetPath = path.join(rootDit, `.data/Data/modules/${moduleId}`);

  console.log(`removing previous module directory: ${targetPath}`);
  await deleteFolderRecursive(targetPath);

  console.log(`copying new module files to ${targetPath}`);
  await copyFolder(outDir, targetPath);

  console.log("module files copied successfully");
}
