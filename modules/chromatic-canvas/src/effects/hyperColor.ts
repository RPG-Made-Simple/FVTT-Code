import type { InternalEffectOptions } from "../effect";
import { animate } from "animejs";

export function hyperColor(options: InternalEffectOptions) {
  const a = 1 * options.intensity;
  const b = 2 * options.intensity;

  let iterationCount = 0;

  const keyframes = [
    { filter: `hue-rotate(0deg) blur(0px)`, rotate: `0deg` },
    { filter: `hue-rotate(45deg) blur(${a}px)`, rotate: `${a}deg` },
    { filter: `hue-rotate(-45deg) blur(${b}px)`, rotate: `-${a}deg` },
    { filter: `hue-rotate(45deg) blur(${a}px)`, rotate: `${a}deg` },
    { filter: `hue-rotate(0deg) blur(0px)`, rotate: `0deg` },
  ];

  animate(`#${options.target}`, {
    keyframes,
    duration: options.duration,
    easing: 'easeInOutSine',
    onComplete: (anim) => {
      iterationCount++;
      if (iterationCount < options.iterations) {
        anim.restart();
      } else {
        anim.pause();
        animate(`#${options.target}`, {
          filter: `hue-rotate(0deg) blur(0px)`,
          rotate: `0deg`,
          duration: 0
        });
      }
    },
  });
}
