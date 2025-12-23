import { defineConfig } from 'vite';
import FoundryPlugin from '@rpgmadesimple/foundry-vite-plugin';
import { defineModuleOptions } from '@rpgmadesimple/foundry-vite-plugin/dist/options/moduleOptions';

const options = defineModuleOptions({
  id: "tags",
  title: "🏷️ Tags (Library)",
  description: "Library that lets you insert tags into documents.",
  version: "2.0.0",
  library: true,
  compatibility: {
    minimum: "13",
    verified: "13.351"
  },
  language: {
    path: "./lang",
    include: [
      {
        lang: "en",
        name: "English",
      },
    ],
  },
  templates: {
    path: "./templates",
    include: ["documentTagsApplication"],
  },
  styles: {
    path: "./styles",
    include: ["tags"]
  },
  relationships: {
    requires: [
      {
        id: "debugger",
        compatibility: {
          minimum: "2",
          verified: "2.0.0"
        },
      },
      {
        id: "toolbox",
        compatibility: {
          minimum: "2",
          verified: "2.0.0"
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
  repo: "https://github.com/RPG-Made-Simple/FVTT-Code",
});

export default defineConfig({
  plugins: [
    FoundryPlugin(options),
  ],
});
