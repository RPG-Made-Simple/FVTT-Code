import { prepareForAPI } from "@rpgmadesimple/utils/src/misc.ts";
import { Constants } from "./constants.ts";
import { requireDebugger, requireToolbox } from "./imports.ts";
import { ChromaticCanvas as ChromaticCanvasClass} from "./chromatic-canvas.ts";
import { CanvasEffectWindow } from "./canvas-effect-window.ts";
import { registerEffects } from "./effect.ts";
import { registerLayers } from "./chromatic-canvas-layer.ts";
import { setupSidebarTools } from "@rpgmadesimple/utils/src/sidebar.ts";

declare global {
  type ChromaticCanvas = typeof ChromaticCanvasClass;
  const ChromaticCanvas: typeof ChromaticCanvasClass;
}

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
  prepareForAPI(Constants.id, ChromaticCanvasClass);

  Constants.t.showcaseModule(Constants.nameFlat);

  Hooks.call('chromatic-canvas.ready');

  Constants.d.info('Ready!');

  new CanvasEffectWindow().render(true);
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
