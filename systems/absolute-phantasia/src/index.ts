import "./types/actor";
import "./types/item";
import { AbsolutePhantasiaActor } from "./documents/actor";

Hooks.once('init', () => {
  console.log("Absolute Phantasia | Initializing");

  CONFIG.Actor.documentClass = AbsolutePhantasiaActor;
})

Hooks.once('ready', () => {
  console.log("Absolute Phantasia | Ready");
})
