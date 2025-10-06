import type { HandleEmptyObject } from "fvtt-types/utils";
import { Constants } from "../constants";

export class TagsInterfaceLayer extends foundry.canvas.layers.InteractionLayer {
  constructor() {
    super();
  }

  static override get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: Constants.interfaceLayer,
      zIndex: 360,
    });
  }

  protected override async _draw(options: HandleEmptyObject<InteractionLayer.DrawOptions>) {
    await super._draw(options);
  }
}
