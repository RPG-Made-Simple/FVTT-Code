import { ModuleOptions } from "./options/moduleOptions";

import { promises as fs } from 'fs';
import path from 'path';
import { copyAssetFiles, copyFolder, copyLangFiles, copyLicenseFile, copyStyleFiles, copyTemplateFiles, createLockFile, deleteFolderRecursive, generateDeclarations } from "./utils";

export async function generateModuleBundle(options: ModuleOptions) {
  console.log("generating module.json...");

  let languageData: {lang: string; name: string; path: string}[] = [];
  if (options.language && options.language.include.length > 0) {
    options.language.include.map((lang) => {
      languageData.push({
        lang: lang.lang,
        name: lang.name,
        path: `./lang/${lang.lang}.json`,
      });
    });
  }

  let templateData: string[] = [];
  if (options.templates && options.templates.include.length > 0) {
    options.templates.include.map((template) => {
      templateData.push(`./templates/${template}.hbs`);
    });
  }

  let styleData: string[] = [];
  if (options.styles && options.styles.include.length > 0) {
    options.styles.include.map((style) => {
      styleData.push(`./styles/${style}.css`);
    });
  }

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
    license: "./LICENSE",
    url: options.repo,
    bugs: `${options.repo}/issues`,
    manifest: `${options.repo}/releases/latest/download/${options.id}.json`,
    download: `${options.repo}/releases/${options.id}-v${options.version}/download/${options.id}.zip`,
    readme: `${options.repo}/blob/main/modules/${options.id}/README.md`,
    changelog: `${options.repo}/blob/main/modules/${options.id}/CHANGELOG.md`,
    esmodules: ["./module.js"],
    styles: styleData.length > 0 ? styleData : undefined,
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

  // await createLockFile(options.id);
  await copyLicenseFile();

  if (options.language && options.language.include.length > 0) {
    await copyLangFiles(options.language.path);
  }

  if (options.templates && options.templates.include.length > 0) {
    await copyTemplateFiles(options.templates.path);
  }

  if (options.styles && options.styles.include.length > 0) {
    await copyStyleFiles(options.styles.path);
  }

  if (options.assets) {
    await copyAssetFiles(options.assets.path);
  }

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
