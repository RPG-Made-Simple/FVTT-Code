import { prepareForAPI } from "@rpgmadesimple/utils/src/misc.ts";
import { Constants } from "./constants.ts";
import { requireDebugger, requireToolbox } from "./imports.ts";
import { ChromaticCanvas as ChromaticCanvasClass} from "./chromatic-canvas.ts";
import { registerEffects } from "./effect.ts";
import { setupSidebarTools } from "@rpgmadesimple/utils/src/sidebar.ts";
import { registerLayers } from "./layer.ts";
import { FilterDatabase } from "./filters/index.ts";

declare global {
  type ChromaticCanvas = typeof ChromaticCanvasClass;
  const ChromaticCanvas: typeof ChromaticCanvasClass;
}

// @ts-ignore
Hooks.once('toolbox.ready', () => {
  const debuggerAPI = requireDebugger();
  Constants.d = new debuggerAPI(Constants.id, Constants.nameFlat, true, false);
  Constants.t = requireToolbox();
  try {
    Constants.s = Constants.t.SocketManager.getSocketForModule(Constants.id);
  } catch (e) {
    console.error(e);
  }

  Constants.d.info('Module information:');
  Constants.d.info(`Version ${Constants.t.getGame().modules.get(Constants.id).version}`);
  Constants.d.info('Library by 🐲 RPG Made Simple');

  registerLayers();
  registerEffects();
  game.canvas?.app?.ticker.add(() => {
    for (const filter of Object.values(FilterDatabase)) {
      if (filter.active) {
        filter.step();
      }
    }
  })
  if (game.canvas && game.canvas.environment) {
    game.canvas.environment.filters = Object.values(FilterDatabase);
  }
  prepareForAPI(Constants.id, ChromaticCanvasClass);

  Constants.t.showcaseModule(Constants.nameFlat);

  // @ts-ignore
  Hooks.call(`${Constants.id}.ready`);

  Constants.d.info('Ready!');

  // new CanvasEffectWindow().render(true);
})

setupSidebarTools(
  [
    // Shake tool
    {
      name: 'shake',
      title: 'Shake',
      icon: 'fa-solid fa-waveform',
      button: true,
      visible: () => true,
      order: 1,
      onEvent: () => {
        ChromaticCanvasClass.shake();
      },
    },
    // Pulsate tool
    {
      name: 'pulsate',
      title: 'Pulsate',
      icon: 'fa-solid fa-wave-pulse',
      button: true,
      visible: () => true,
      order: 2,
      onEvent: () => {
        ChromaticCanvasClass.pulsate({
          iterations: 3,
        });
      },
    },
    // Spin tool
    {
      name: 'spin',
      title: 'Spin',
      icon: 'fa-solid fa-rotate-right',
      button: true,
      visible: () => true,
      order: 3,
      onEvent: () => {
        ChromaticCanvasClass.spin({
          duration: 1000,
        });
      },
    },
    // Hyper color tool
    {
      name: 'hyper-color',
      title: 'Hyper Color',
      icon: 'fa-solid fa-arrows-to-eye',
      button: true,
      visible: () => true,
      order: 4,
      onEvent: () => {
        ChromaticCanvasClass.hyperColor({
          iterations: 10,
          duration: 500,
        });
      },
    }
  ],
  // Control
  {
    id: Constants.id,
    title: Constants.nameFlat,
    icon: 'fa-solid fa-hand-sparkles',
    layer: Constants.interfaceLayer,
    visible: () => game.user?.isGM as boolean,
  },
);
