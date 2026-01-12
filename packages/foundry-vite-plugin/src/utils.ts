import { promises as fs } from 'fs';
import path from 'path';
import ts from 'typescript';

export async function deleteFolderRecursive(folderPath: string) {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
  } catch (err) {
    console.error(`Failed to delete folder: ${folderPath}`, err);
  }
}

export async function copyFolder(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  console.log(`Listing files in ${src}:`, entries.map(e => e.name));

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    console.log(`copying file ${srcPath} to ${destPath}`);

    if (entry.isDirectory()) {
      await copyFolder(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

export function generateDeclarations() {
  const entry = path.resolve(process.cwd(), "src/index.ts");
  console.log("generating declarations for:", entry);

  const options: ts.CompilerOptions = {
    declaration: true,
    emitDeclarationOnly: true,
    outDir: path.resolve(process.cwd(), 'dist/types'),
    skipLibCheck: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
  };

  const program = ts.createProgram([entry], options);
  const emitResult = program.emit();

  const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  if (diagnostics.length) {
    diagnostics.forEach(diag => {
      if (diag.file) {
        const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start!);
        const message = ts.flattenDiagnosticMessageText(diag.messageText, "\n");
        console.error(`${diag.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.error(ts.flattenDiagnosticMessageText(diag.messageText, "\n"));
      }
    });
  } else {
    console.log("successfuly generated declarations");
  }
}

export async function copyLangFiles(langPath: string) {
  console.log("copying lang files...");

  const langSrc = path.resolve(process.cwd(), langPath);
  const langDest = path.resolve(process.cwd(), "./dist/lang");
  await fs.mkdir(langDest, { recursive: true });
  const files = await fs.readdir(langSrc);

  for (const file of files) {
    const srcPath = path.join(langSrc, file);
    const destPath = path.join(langDest, file);

    if (file.endsWith(".json")) {
      const content = await fs.readFile(srcPath, "utf-8");
      const minifiedContent = JSON.stringify(JSON.parse(content));
      await fs.writeFile(destPath, minifiedContent, "utf-8");
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }

  console.log("lang files copied");
}

export async function copyTemplateFiles(templatePath: string) {
  console.log("copying template files...");

  const templateSrc = path.resolve(process.cwd(), templatePath);
  const templateDest = path.resolve(process.cwd(), "./dist/templates");
  await fs.mkdir(templateDest, { recursive: true });
  const files = await fs.readdir(templateSrc);

  for (const file of files) {
    const srcPath = path.join(templateSrc, file);
    const destPath = path.join(templateDest, file);

    await fs.copyFile(srcPath, destPath);
  }

  console.log("template files copied");
}

export async function copyStyleFiles(stylePath: string) {
  console.log("copying style files...");

  const styleSrc = path.resolve(process.cwd(), stylePath);
  const styleDest = path.resolve(process.cwd(), "./dist/styles");
  await fs.mkdir(styleDest, { recursive: true });
  const files = await fs.readdir(styleSrc);

  for (const file of files) {
    const srcPath = path.join(styleSrc, file);
    const destPath = path.join(styleDest, file);

    await fs.copyFile(srcPath, destPath);
  }

  console.log("style files copied");
}

export async function copyAssetFiles(assetsPath: string) {
  console.log("copying asset files...");

  const assetSrc = path.resolve(process.cwd(), assetsPath);
  const assetDest = path.resolve(process.cwd(), `./dist/${assetsPath}`);

  try {
    await copyFolder(assetSrc, assetDest);
    console.log("asset files copied successfully");
  } catch (error) {
    console.error("Error copying assets:", error);
  }

  console.log("assets copied");
}

export async function copyLicenseFile() {
  console.log("copying license file...");

  try {
    await fs.copyFile('./LICENSE', './dist/LICENSE');
  } catch (error) {
    console.error("Error copying license file:", error);
  }

  console.log("license file copied")
}

export async function createLockFile(id: string) {
  console.log("creating lock file...");

  try {
    await fs.writeFile(`./dist/${id}.lock`, '🔒');
  } catch (error) {
    console.error("Error creating lock file:", error);
  }

  console.log("lock file created")
}
