import type { InternalEffectOptions } from "../effect";
import { animate } from "animejs";

export function shake(options: InternalEffectOptions) {
  const a = 1 * options.intensity;
  const b = 2 * options.intensity;
  const c = 3 * options.intensity;

  let iterations = 0;
  animate(`#${options.target}`, {
    keyframes: [
      { translateX:  a, translateY:  a, rotate:  0 },
      { translateX: -a, translateY: -b, rotate: -a },
      { translateX: -c, translateY: -b, rotate:  a },
      { translateX:  c, translateY:  b, rotate:  0 },
      { translateX:  a, translateY: -a, rotate:  a },
      { translateX:  a, translateY:  b, rotate: -a },
      { translateX: -c, translateY:  a, rotate:  0 },
      { translateX:  c, translateY:  a, rotate: -a },
      { translateX: -a, translateY: -a, rotate:  a },
      { translateX:  a, translateY:  b, rotate:  0 },
      { translateX:  a, translateY: -b, rotate: -a },
    ],
    duration: options.duration,
    onBegin: () => {
      iterations++;
    },
    onComplete: (anim) => {
      if (iterations < options.iterations) {
        anim.restart();
      } else {
        anim.reset();
      }
    },
  });
}
