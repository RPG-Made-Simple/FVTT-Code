const {
  HandlebarsApplicationMixin,
  ApplicationV2
} = foundry.applications.api;

export class CanvasEffectWindow extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor() {
    super({
      window: {
        title: "Test"
      }
    });
  }
}
