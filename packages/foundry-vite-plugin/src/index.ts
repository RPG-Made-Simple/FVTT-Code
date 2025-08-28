import { Plugin } from 'vite';
import { promises as fs } from 'fs';
import path from 'path';
import ts from 'typescript';

async function deleteFolderRecursive(folderPath: string) {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
  } catch (err) {
    console.error(`Failed to delete folder: ${folderPath}`, err);
  }
}

async function copyFolder(src: string, dest: string) {
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

interface FoundryModuleOptions {
  id: string;
  title: string;
  description: string;
  version: string;
  library?: boolean;
  socket?: boolean,
  compatibility: {
    minimum: string,
    maximum?: string,
    verified: string,
  },
  relationships?: {
    systems?: Array<{
      id: string,
      compatibility?: {
        minimum: string,
        maximum?: string,
        verified: string,
      },
    }>,
    requires?: Array<{
      id: string,
      manifest?: string,
      compatibility?: {
        minimum: string,
        maximum?: string,
        verified: string,
      },
    }>,
    recommends?: Array<{
    id: string,
      manifest?: string,
      compatibility?: {
        minimum: string,
        maximum?: string,
        verified: string,
      },
    }>,
  },
  authors: Array<{
    name: string;
    email?: string;
    url?: string;
    discord?: string;
  }>;
  languages: Array<{
    lang: string;
    name: string;
  }>;
  repo: string;
}

interface FoundryPluginOptions {
  module: FoundryModuleOptions;
}

export default function FoundryPlugin(options: FoundryPluginOptions): Plugin {
  return {
    name: 'foundry-vite-plugin',
    apply: 'build',
    async generateBundle() {
      console.log('Generating module.json...');

      const languageData = options.module.languages.map((lang) => ({
        lang: lang.lang,
        name: lang.name,
        path: `./lang/${lang.lang}.json`,
      }));

      const structuredData = {
        id: options.module.id,
        title: options.module.title,
        description: options.module.description,
        version: options.module.version,
        library: options.module.library,
        socket: options.module.socket,
        authors: options.module.authors,
        languages: languageData,
        relationships: options.module.relationships,
        compatibility: {
          minimum: '10',
          verified: '12',
        },
        license: './LICENSE.md',
        url: options.module.repo,
        bugs: `${options.module.repo}/issues`,
        manifest: `${options.module.repo}/releases/latest/download/${options.module.id}.json`,
        download: `${options.module.repo}/releases/latest/download/${options.module.id}.zip`,
        readme: `${options.module.repo}/blob/main/modules/${options.module.id}/README.md`,
        changelog: `${options.module.repo}/blob/main/modules/${options.module.id}/CHANGELOG.md`,
        esmodules: ['./module.js'],
      };

      const outDir = path.resolve(process.cwd(), 'dist');
      const outputPath = path.join(outDir, 'module.json');

      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(
        outputPath,
        JSON.stringify(structuredData, null, 2),
        'utf-8'
      );

      console.log('module.json generated');
      console.log('copying lang files...');

      const langSrc = path.resolve(process.cwd(), './lang');
      const langDest = path.resolve(process.cwd(), './dist/lang');
      await fs.mkdir(langDest, { recursive: true });
      const files = await fs.readdir(langSrc);

      for (const file of files) {
        const srcPath = path.join(langSrc, file);
        const destPath = path.join(langDest, file);

        if (file.endsWith('.json')) {
          const content = await fs.readFile(srcPath, 'utf-8');
          const minifiedContent = JSON.stringify(JSON.parse(content));
          await fs.writeFile(destPath, minifiedContent, 'utf-8');
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }

      console.log('lang files copied');
    },
    async writeBundle() {
      const outDir = path.resolve(process.cwd(), 'dist');
      const rootDir = path.resolve(process.cwd(), '../../');
      const targetPath = path.join(rootDir, `.data/Data/modules/${options.module.id}`);

      console.log(`removing previous module directory: ${targetPath}`);
      await deleteFolderRecursive(targetPath);

      console.log(`copying new module files to ${targetPath}`);
      await copyFolder(outDir, targetPath);

      console.log('module files copied successfully');

      generateDeclarations();
    },
    config(config) {
      config.build = {
        ...config.build,
        lib: {
          entry: path.resolve(process.cwd(), './src/index.ts'),
          name: options.module.id,
          fileName: () => 'module.js',
          formats: ['es'],
        },
        outDir: './dist',
        sourcemap: true,
        minify: false,
        terserOptions: {
          mangle: false,
          compress: false,
        },
        rollupOptions: {
          output: {
            compact: false,
            minifyInternalExports: false,
          },
          treeshake: false,
        },
      };
      config.esbuild = {
        loader: 'ts',
        include: /\.ts$/,
        exclude: /node_modules/,
        minify: undefined,
        treeShaking: false,
      };
      return config;
    },
  };
}
