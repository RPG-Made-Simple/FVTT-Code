import { defineConfig } from 'vite';
import FoundryPlugin from '@rpgmadesimple/foundry-vite-plugin';
import { defineSystemOptions } from '@rpgmadesimple/foundry-vite-plugin/dist/options/systemOptions';

const options = defineSystemOptions({
  id: "absolute-phantasia",
  title: "Absolute Phantasia",
  description: "An original RPG system designed specifically for the Foundry Virtual Tabletop environment, offering a streamlined and dynamic experience for online play.",
  version: "1.0.0",
  socket: false,
  initiative: "1d20",
  compatibility: {
    minimum: "13",
    verified: "13.351",
  },
  authors: [
    {
      name: "Zoty",
      email: "zotydev@gmail.com",
      url: "https://zoty.dev",
      discord: "zotydev",
    },
  ],
  relationships: {},
  language: {
    path: "./lang",
    include: [
      {
        lang: "en",
        name: "English",
      },
    ],
  },
  grid: {
    distance: 1.5,
    units: "m",
  },
  primaryTokenAttribute: "resources.health",
  secondaryTokenAttribute: "resources.power",
  repo: "https://github.com/RPG-Made-Simple/FVTT-Code",
});

export default defineConfig({
  plugins: [
    FoundryPlugin(options),
  ]
})
