import { LibraryOptions, Plugin } from 'vite';
import path from 'path';
import { ModuleOptions, TypedModuleOptions } from './options/moduleOptions';
import { generateModuleBundle, writeModuleBundle } from './module';
import { SystemOptions, TypedSystemOptions } from './options/systemOptions';
import { ArtifactType } from './options/common';
import { generateSystemBundle, writeSystemBundle } from './system';

export default function FoundryPlugin(options: TypedModuleOptions | TypedSystemOptions): Plugin {
  let lib: false | LibraryOptions | undefined;
  switch (options.type) {
    case ArtifactType.MODULE: {
      lib = {
        entry: path.resolve(process.cwd(), "./src/index.ts"),
        name: options.options.id,
        fileName: () => "module.js",
        formats: ["es"],
      }
      break;
    }
    case ArtifactType.SYSTEM: {
      lib = {
        entry: path.resolve(process.cwd(), "./src/index.ts"),
        name: options.options.id,
        fileName: () => "system.js",
        formats: ["es"],
      }
      break;
    }
  }

  return {
    name: 'foundry-vite-plugin',
    apply: 'build',
    async generateBundle() {
      switch (options.type) {
        case ArtifactType.MODULE:
          generateModuleBundle(options.options as ModuleOptions);
          break;
        case ArtifactType.SYSTEM:
          generateSystemBundle(options.options as SystemOptions);
          break;
      }
    },
    async writeBundle() {
      switch (options.type) {
        case ArtifactType.MODULE:
          writeModuleBundle(options.options.id);
          break;
        case ArtifactType.SYSTEM:
          writeSystemBundle(options.options.id);
          break;
      }
    },
    config(config) {
      config.build = {
        ...config.build,
        lib: lib,
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
