import { defineConfig } from 'vite';
import FoundryPlugin from '@rpgmadesimple/foundry-vite-plugin';

export default defineConfig({
  plugins: [
    FoundryPlugin({
      module: {
        id: 'toolbox',
        title: '🛠️ Toolbox (Library)',
        description: 'Library that adds common utilities.',
        version: '2.0.0',
        library: true,
        compatibility: {
          minimum: '13',
          verified: '13.347'
        },
        relationships: {
          requires: [
            {
              id: 'debugger',
              compatibility: {
                minimum: '2',
                verified: '2.0.0'
              }
            }
          ]
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
    })
  ],
});
