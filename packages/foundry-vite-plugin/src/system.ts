import { SystemOptions } from "./options/systemOptions";

import { promises as fs } from 'fs';
import path from 'path';
import { copyFolder, copyLangFiles, copyStyleFiles, copyTemplateFiles, deleteFolderRecursive, generateDeclarations } from "./utils";

export async function generateSystemBundle(options: SystemOptions) {
  console.log("generating system.json...");

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
    socket: options.socket,
    initiative: options.initiative,
    grid: options.grid,
    primaryTokenAttribute: options.primaryTokenAttribute,
    secondaryTokenAttribute: options.secondaryTokenAttribute,
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
    esmodules: ["./system.js"],
  };

  const outDir = path.resolve(process.cwd(), "dist");
  const outputPath = path.join(outDir, "system.json");

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(structuredData, null, 2),
    "utf8",
  );

  console.log("system.json generated");

  if (options.template) {
    const templateSrc = path.resolve(process.cwd(), options.template);
    const templateDest = path.join(outDir, "template.json");
    await fs.copyFile(templateSrc, templateDest);
    console.log("template.json copied");
  }

  if (options.language && options.language.include.length > 0) {
      await copyLangFiles(options.language.path);
    }

    if (options.templates && options.templates.include.length > 0) {
      await copyTemplateFiles(options.templates.path);
    }

    if (options.styles && options.styles.include.length > 0) {
      await copyStyleFiles(options.styles.path);
    }

  generateDeclarations();
}

export async function writeSystemBundle(systemId: string) {
  const outDir = path.resolve(process.cwd(), "dist");
  const rootDit = path.resolve(process.cwd(), "../../");
  const targetPath = path.join(rootDit, `.data/Data/systems/${systemId}`);

  console.log(`removing previous system directory: ${targetPath}`);
  await deleteFolderRecursive(targetPath);

  console.log(`copying new system files to ${targetPath}`);
  await copyFolder(outDir, targetPath);

  console.log("module files copied successfully");
}
