import { defineConfig } from 'vite';
import FoundryPlugin from '@rpgmadesimple/foundry-vite-plugin';
import { defineModuleOptions } from '@rpgmadesimple/foundry-vite-plugin/dist/options/moduleOptions';

const options = defineModuleOptions({
  id: "bifrost-coc7-bridge",
  title: "🌈 Bifrost - Call of Cthulhu 7 (CoC7)",
  description: "A bridge for the system Call of Cthulhu 7 (CoC7).",
  version: "1.0.0",
  library: true,
  socket: true,
  compatibility: {
    minimum: "13",
    verified: "13.347"
  },
  relationships: {
    systems: [
      {
        id: "CoC7",
        compatibility: {
          minimum: "7",
          verified: "7.19",
        },
      },
    ],
    requires: [
      {
        id: "debugger",
        compatibility: {
          minimum: "2",
          verified: "2.0.0",
        },
      },
      {
        id: "toolbox",
        compatibility: {
          minimum: "2",
          verified: "2.0.0",
        },
      },
      {
        id: "bifrost",
        compatibility: {
          minimum: "1",
          verified: "1.0.0",
        },
      },
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
  languagePath: "./lang",
  languages: [
    {
      lang: "en",
      name: "English",
    },
  ],
  repo: "https://github.com/RPG-Made-Simple/FVTT-Code",
});

export default defineConfig({
  plugins: [
    FoundryPlugin(options),
  ]
})
