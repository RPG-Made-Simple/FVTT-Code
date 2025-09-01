import type { HandleEmptyObject } from "fvtt-types/utils";
import { Constants } from "../constants";

export class ChromaticCanvasPrimaryLayer extends InteractionLayer {
  constructor() {
    super();
  }

  static override get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: Constants.primaryLayer,
      zIndex: 350,
    })
  }

  protected override async _draw(options: HandleEmptyObject<InteractionLayer.DrawOptions>): Promise<void> {
    await super._draw(options);
  }
}
