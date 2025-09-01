import type { AnimationType } from "./animationType";

export class AnimationMeta {
  private _name: string;
  private _type: AnimationType;
  private _duration: number;

  constructor(data: {
    name: string,
    type: AnimationType
    duration: number;
  }) {
    this._name = data.name;
    this._type = data.type;
    this._duration = data.duration;
  }

  public get id() {
    return `${this._type}_${this._name}`
  }

  public get duration() {
    return this._duration;
  }
}
