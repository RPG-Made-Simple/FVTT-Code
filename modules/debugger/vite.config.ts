import { defineConfig } from 'vite';
import FoundryPlugin from '@rpgmadesimple/foundry-vite-plugin';

export default defineConfig({
  plugins: [
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
