import { defineConfig } from 'vite';
import dtsPlugin from 'vite-plugin-dts';
import FoundryPlugin from '@rpgmadesimple/foundry-vite-plugin';

export default defineConfig({
  plugins: [
    dtsPlugin({
      entryRoot: 'src/index.ts',
      outDir: 'types',
      insertTypesEntry: true,
      logLevel: 'info',
    }),
    FoundryPlugin({
      module: {
        id: 'debugger',
        title: '🕷️ Debugger (Library)',
        description: 'Library that adds debugger helpers',
        version: '2.0.0',
        library: true,
        authors: [
          {
            name: 'ZotyDev',
            email: 'official@zoty.dev',
            url: 'https://zoty.dev',
            discord: 'zotydev',
          },
        ],
        languages: [
          {
            lang: 'en',
            name: 'English'
          },
        ],
        repo: 'https://github.com/RPG-Made-Simple/FVTT-Code',
      },
    }),
  ],
});
