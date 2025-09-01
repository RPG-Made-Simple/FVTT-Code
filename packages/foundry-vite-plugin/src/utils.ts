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

function generateDeclarations() {
  const entry = path.resolve(process.cwd(), 'src/index.ts');
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
