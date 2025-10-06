import { defineConfig } from 'vite';
import FoundryPlugin from '@rpgmadesimple/foundry-vite-plugin';
import { defineModuleOptions } from '@rpgmadesimple/foundry-vite-plugin/dist/options/moduleOptions';

const options = defineModuleOptions({
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
  repo: 'https://github.com/RPG-Made-Simple/FVTT-Code',
});

export default defineConfig({
  plugins: [
    FoundryPlugin(options),
  ],
});
