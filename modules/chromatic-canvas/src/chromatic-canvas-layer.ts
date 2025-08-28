import type { HandleEmptyObject } from "fvtt-types/utils";
import { Constants } from "./constants";

class ChromaticCanvasInterfaceLayer extends InteractionLayer {
  constructor() {
    super();
  }

  static override get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: Constants.interfaceLayer,
      zIndex: 360,
    })
  }

  protected override async _draw(options: HandleEmptyObject<InteractionLayer.DrawOptions>){
    await super._draw(options);
  }
}

export function registerLayers() {
  CONFIG.Canvas.layers = foundry.utils.mergeObject(CONFIG.Canvas.layers, {
    chromaticCnavasInterfaceLayer: {
      layerClass: ChromaticCanvasInterfaceLayer,
      group: 'interface',
    }
  });
}
