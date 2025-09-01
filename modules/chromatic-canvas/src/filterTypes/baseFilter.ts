import type { AnimationAttribute } from "../animation/animationAttribute";
import type { AnimationMeta } from "../animation/animationMeta";
import { AnimationState } from "../animation/animationState";
import { AnimationStatus } from "../animation/animationStatus";
import { fullscreenFrag } from "../shaders/frag/fullscreenFrag";
import { fullscreenVert } from "../shaders/vert/fullscreenVert";

export interface FilterAttributes {
  name: string;
  id: string;
}

export abstract class BaseFilter extends PIXI.Filter {
  protected animationMeta: AnimationMeta;
  protected animationStatus: AnimationStatus = AnimationStatus.UNACTIVE;
  protected animationState: AnimationState = AnimationState.START;
  protected attributes: Record<string, AnimationAttribute> = {};

  constructor(data: {
    meta: AnimationMeta,
    attributes: Record<string, AnimationAttribute>,
    vert?: string,
    frag?: string,
  }) {
    const uniforms: Record<string, number> = {};
    for (const [name, attribute] of Object.entries(data.attributes)) {
      uniforms[name] = attribute.from;
    }

    super(
      data.vert ?? fullscreenVert,
      data.frag ?? fullscreenFrag,
      uniforms,
    );

    this.animationMeta = data.meta;
    this.attributes = data.attributes;
  }

  public get active() {
    return this.animationStatus === AnimationStatus.ACTIVE;
  }

  public async play() {
    this.animationStatus = AnimationStatus.ACTIVE;
    this.animationState = AnimationState.END;
  }

  public async stop() {
    this.animationStatus = AnimationStatus.UNACTIVE;
    this.animationState = AnimationState.START;
  }

  public async toggle(): Promise<void> {
    if (this.animationStatus === AnimationStatus.ACTIVE) {
      await this.stop();
    } else {
      await this.play();
    }
  }

  public async step(): Promise<void> {}
}
