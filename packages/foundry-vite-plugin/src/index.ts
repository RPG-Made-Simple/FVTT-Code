import { Plugin } from 'vite';
import { promises as fs } from 'fs';
import path from 'path';

interface FoundryModuleOptions {
  id: string;
  title: string;
  description: string;
  version: string;
  library?: boolean;
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
        authors: options.module.authors,
        languages: languageData,
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
        relationships: {},
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
