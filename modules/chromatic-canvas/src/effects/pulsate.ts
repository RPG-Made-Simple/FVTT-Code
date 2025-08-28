import { animate } from "animejs";
import type { EffectOptions } from "../effect";

export function pulsate(options: EffectOptions) {
  const a = options.intensity > 1 ? 1.2 : options.intensity < 1 ? 1.05 : 1.1;
  const b = options.intensity > 1 ? 1.1 : options.intensity < 1 ? 1.025 : 1.05;

  let iterations = 0;
  animate(`#${options.target}`, {
    keyframes: [
      { scale: a },
      { scale: b },
    ],
    duration: options.duration,
    onBegin: function (anim) {
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
