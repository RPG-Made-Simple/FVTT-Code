import { defineConfig } from 'vite';
import FoundryPlugin from '@rpgmadesimple/foundry-vite-plugin';
import { defineModuleOptions } from '@rpgmadesimple/foundry-vite-plugin/dist/options/moduleOptions';

const options = defineModuleOptions({
  id: "sounds",
  title: "🎶 Sounds",
  description: "Sound effects library for Sequencer.",
  version: "1.0.0",
  library: true,
  compatibility: {
    minimum: "13",
    verified: "13.351"
  },
  assets: {
    path: "./assets",
  },
  relationships: {
    requires: [
      {
        id: "sequencer",
        compatibility: {
          minimum: "3.6.11",
          verified: "3.6.11"
        },
      }
    ]
  },
  authors: [
    {
      name: "Zoty",
      email: "zotydev@gmail.com",
      url: "https://zoty.dev",
      discord: "zotydev",
    },
  ],
  repo: "https://github.com/RPG-Made-Simple/FVTT-Code",
});

export default defineConfig({
  plugins: [
    FoundryPlugin(options),
  ],
});
