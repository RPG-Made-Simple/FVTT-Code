import { Constants } from "../constants";

const {
  HandlebarsApplicationMixin,
  ApplicationV2
} = foundry.applications.api;

export class DocumentTagsApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static override DEFAULT_OPTIONS = {
    id: "document-tags",
    position: {
      width: 640,
      height: "auto" as const,
    },
    window: {
      icon: "fas fa-tag",
      title: `${Constants.id}.applications.tags.title`
    }
  }

  static override PARTS = {
    documentTags: {
      template: "./modules/tags/templates/documentTagsApplication.hbs",
    }
  }
}
