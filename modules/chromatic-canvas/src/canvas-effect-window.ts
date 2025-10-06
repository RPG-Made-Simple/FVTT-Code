import { localize } from "@rpgmadesimple/utils/src/localization";
import { Constants } from "./constants";

const {
  HandlebarsApplicationMixin,
  ApplicationV2
} = foundry.applications.api;

export class CanvasEffectWindow extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor() {
    super({
      id: "document-tags",
      window: {
        title: localize(Constants.id, "itemtags.applications.tags.title"),
      },
      form: {
        closeOnSubmit: false,
        submitOnChange: true,
      },
      classes: ["tags-application"],
    });
  }


}
