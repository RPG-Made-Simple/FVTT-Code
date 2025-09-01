import { ChromaticCanvasInterfaceLayer } from "./layers/interface-layer";
import { ChromaticCanvasPrimaryLayer } from "./layers/primary-layer";

export function registerLayers() {
  CONFIG.Canvas.layers = foundry.utils.mergeObject(CONFIG.Canvas.layers, {
    chromaticCnavasInterfaceLayer: {
      layerClass: ChromaticCanvasInterfaceLayer,
      group: 'interface',
    },
    chromaticCanvasPrimaryLayer: {
      layerClass: ChromaticCanvasPrimaryLayer,
      group: 'primary',
    }
  });
}
