import { dispatch, EffectType, type EffectOptions, type TargetOptions } from "./effect";
import { FilterDatabase } from "./filters";

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

  static hyperColor(options?: EffectOptions, target?: TargetOptions) {
    dispatch(EffectType.HYPER_COLOR, options, target);
  }

  static filters: typeof FilterDatabase = FilterDatabase;
}
