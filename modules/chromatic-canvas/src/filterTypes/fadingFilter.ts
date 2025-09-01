import { getCanvasAnimation } from "@rpgmadesimple/utils/src/futureProof";
import type { AnimationAttribute, AnimationTweenData } from "../animation/animationAttribute";
import type { AnimationMeta } from "../animation/animationMeta";
import { AnimationState } from "../animation/animationState";
import { AnimationStatus } from "../animation/animationStatus";
import { BaseFilter } from "./baseFilter";

export abstract class FadingFilter extends BaseFilter {
  constructor(data: {
    meta: AnimationMeta,
    attributes: Record<string, AnimationAttribute>,
    vert?: string,
    frag?: string,
  }) {
    super(data);
  }

  public getAnimationTweenData(): AnimationTweenData[] {
    let tweenData: AnimationTweenData[] = [];
    for (const [name, attribute] of Object.entries(this.attributes)) {
      switch (this.animationState) {
        case AnimationState.START:
          tweenData.push(...attribute.get_animation().map(t => ({
            parent: this.uniforms,
            attribute: name,
            from: t.from,
            to: t.to,
          })));
          this.animationState = AnimationState.PLAYING;
          break;
        case AnimationState.PLAYING:
          tweenData.push(...attribute.get_reverse(this.uniforms[name]).map(t => ({
            parent: this.uniforms,
            attribute: name,
            from: t.from,
            to: t.to,
          })));
          this.animationState = AnimationState.REVERSE;
          break;
        case AnimationState.REVERSE:
          tweenData.push(...attribute.get_animation(this.uniforms[name]).map(t => ({
            parent: this.uniforms,
            attribute: name,
            from: t.from,
            to: t.to,
          })));
          this.animationState = AnimationState.PLAYING;
          break;
        case AnimationState.END:
          tweenData.push(...attribute.get_reverse().map(t => ({
            parent: this.uniforms,
            attribute: name,
            from: t.from,
            to: t.to,
          })));
          this.animationState = AnimationState.REVERSE;
          break;
      }
    }
    return tweenData;
  }

  private stopAnimation() {
    getCanvasAnimation().terminateAnimation(this.animationMeta.id)
  }

  private async animate(options: any) {
    this.stopAnimation();
    return getCanvasAnimation().animate(options, {
      duration: this.animationMeta.duration,
      name: this.animationMeta.id,
    });
  }

  public override play(): Promise<void> {
    this.animationStatus = AnimationStatus.ACTIVE;
    let animation = this.getAnimationTweenData();
    return this.animate(animation).then((completed) => {
      if (completed) {
        this.animationState = AnimationState.END;
      }
    })
  }

  public override stop(): Promise<void> {
    let animation = this.getAnimationTweenData();
    return this.animate(animation).then((completed) => {
      if (completed) {
        this.animationState = AnimationState.START;
        this.animationStatus = AnimationStatus.UNACTIVE;
      }
    })
  }
}
