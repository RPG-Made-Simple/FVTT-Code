import { prepareForAPI } from "@rpgmadesimple/utils/src/misc.ts";
import { Constants } from "./constants.ts";
import { requireDebugger, requireToolbox } from "./imports.ts";
import { ChromaticCanvas as ChromaticCanvasClass} from "./chromatic-canvas.ts";
import { CanvasEffectWindow } from "./canvas-effect-window.ts";
import { registerEffects } from "./effect.ts";
import { registerLayers } from "./chromatic-canvas-layer.ts";

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

Hooks.on('getSceneControlButtons', (controls) => {
  if (!game.user?.isGM) return;

  const shakeTool: SceneControls.Tool = {
    name: 'shake',
    title: 'Shake',
    icon: 'fa-solid fa-waveform',
    button: true,
    visible: true,
    // @ts-ignore
    onChange: () => {
      ChromaticCanvasClass.shake();
    },
    order: 2,
  };

  const pulsateTool: SceneControls.Tool = {
    name: 'pulsate',
    title: 'Pulsate',
    icon: 'fa-solid fa-wave-pulse',
    button: true,
    visible: true,
    // @ts-ignore
    onChange: () => {
      ChromaticCanvasClass.pulsate({
        iterations: 3,
      });
    },
    order: 3,
  };

  const spinTool: SceneControls.Tool = {
    name: 'spin',
    title: 'Spin',
    icon: 'fa-solid fa-rotate-right',
    button: true,
    visible: true,
    // @ts-ignore
    onChange: () => {
      ChromaticCanvasClass.spin({
        duration: 1000,
      });
    },
    order: 4,
  };

  const control: SceneControls.Control = {
    name: Constants.id,
    title: Constants.nameFlat,
    icon: 'fa-solid fa-hand-sparkles',
    visible: true,
    layer: Constants.interfaceLayer,
    tools: {
      // @ts-ignore
      shake: shakeTool,
      pulsate: pulsateTool,
      spin: spinTool,
    },
    activeTool: '',
    order: 99,
  };

  // @ts-ignore
  controls[Constants.id] = control;
});
