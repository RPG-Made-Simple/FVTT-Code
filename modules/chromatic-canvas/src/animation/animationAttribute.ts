export interface AnimationTweenData {
  attribute: string;
  from: number;
  to: number;
}

export abstract class AnimationAttribute {
  constructor() {}

  public abstract get path(): string;
  public abstract get from(): number;
  public abstract get to(): number;

  public abstract get_animation(from?: any): AnimationTweenData[];
  public abstract get_reverse(from?: any): AnimationTweenData[];
}

export class AnimationNumber extends AnimationAttribute{
  protected _path: string;
  protected _from: number;
  protected _to: number;

  public override get path(): string {
    return this._path;
  }

  public override get from(): number {
    return this._from;
  }

  public override get to(): number {
    return this._to;
  }

  constructor(options: {
    path: string,
    from: number,
    to: number,
  }) {
    super();
    this._path = options.path;
    this._from = options.from;
    this._to = options.to;
  }

  public override get_animation(from?: any): AnimationTweenData[] {
    return [
      {
        attribute: this._path,
        from: from ?? this._from,
        to: this._to,
      }
    ]
  }

  public override get_reverse(from?: any): AnimationTweenData[] {
    return [
      {
        attribute: this._path,
        from: from ?? this._to,
        to: this._from,
      }
    ]
  }
}
