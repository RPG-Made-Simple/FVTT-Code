import { defineConfig } from 'vite';
import FoundryPlugin from '@rpgmadesimple/foundry-vite-plugin';

export default defineConfig({
  plugins: [
    FoundryPlugin({
      module: {
        id: 'chromatic-canvas',
        title: '🎴 Chromatic Canvas (Library)',
        description: 'Library that adds special effects to the canvas.',
        version: '2.0.0',
        library: true,
        socket: true,
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
