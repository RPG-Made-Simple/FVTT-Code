import { dispatch, EffectType, type EffectOptions, type TargetOptions } from "./effect";

export class ChromaticCanvas {
  static shake(options?: EffectOptions, target?: TargetOptions) {
    dispatch(EffectType.SHAKE, options, target);
  }

  static pulsate(options?: EffectOptions, target?: TargetOptions) {
    dispatch(EffectType.PULSATE, options, target);
  }

  static spin(options?: EffectOptions, target?: TargetOptions) {
    dispatch(EffectType.SPIN, options, target);
  }
}
