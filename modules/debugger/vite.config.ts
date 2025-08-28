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
        compatibility: {
          minimum: '13',
          verified: '13.347'
        },
        authors: [
          {
            name: 'ZotyDev',
            email: 'zotydev@gmail.com',
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
