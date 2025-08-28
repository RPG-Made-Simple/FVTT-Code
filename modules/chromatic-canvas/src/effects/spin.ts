import { animate } from "animejs";
import type { EffectOptions } from "../effect";

export function spin(options: EffectOptions) {
  let iterations = 0;
  animate(`#${options.target}`, {
    keyframes: [
      { rotate: 369 * options.iterations },
    ],
    ease: 'inOutQuad',
    duration: options.duration,
    onComplete: function (anim) {
      anim.reset();
    },
  });
}
