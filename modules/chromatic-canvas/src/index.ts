import { prepareForAPI } from "@rpgmadesimple/utils/src/misc.ts";
import { Constants } from "./constants.ts";
import { requireDebugger, requireToolbox } from "./imports.ts";
import { ChromaticCanvas as ChromaticCanvasClass} from "./chromatic-canvas.ts";
import { CanvasEffectWindow } from "./canvas-effect-window.ts";
import { registerEffects } from "./effect.ts";

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

  registerEffects();
  prepareForAPI(Constants.id, ChromaticCanvasClass);

  Constants.t.showcaseModule(Constants.nameFlat);

  Hooks.call('chromatic-canvas.ready');

  Constants.d.info('Ready!');

  new CanvasEffectWindow().render(true);
})

Hooks.on('getSceneControlButtons', (controls) => {
  console.warn(controls);

  const shakeTool: SceneControls.Tool = {
    name: 'shake',
    title: 'Shake',
    icon: 'fa-solid fa-waveform',
    // @ts-ignore
    onChange() {
      console.error('test');
      // ChromaticCanvasClass.shake({
      //   intensity: 1,
      //   duration: 500,
      //   iterations: 1,
      //   target: 'board',
      // });
      console.error('test');
    },
    button: true,
  };

  const control: SceneControls.Control = {
    name: Constants.id,
    title: Constants.nameFlat,
    icon: 'fa-solid fa-hand-sparkles',
    visible: true,
    tools: {
      // @ts-ignore
      shakeTool,
    },
    layer: 'tiles',

  };

  // @ts-ignore
  controls[Constants.id] = control;
});
