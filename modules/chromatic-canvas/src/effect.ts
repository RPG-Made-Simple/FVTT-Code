import { Constants } from "./constants";
import { Misc } from "@rpgmadesimple/utils";
import { shake } from "./effects/shake";
import { pulsate } from "./effects/pulsate";
import { spin } from "./effects/spin";

export enum EffectType {
  SHAKE = 'shake',
  PULSATE = 'pulsate',
  SPIN = 'spin',
}

export interface EffectOptions {
  intensity: number,
  duration: number,
  iterations: number,
  target: string | string[],
}

const EffectOptionsSchema = {
  intensity: ['number', 'undefined'],
  duration: ['number', 'undefined'],
  iterations: ['number', 'undefined'],
  target: ['string', 'array', 'undefined'],
}

const defaultEffectOptions: EffectOptions = {
  intensity: 1,
  duration: 500,
  iterations: 1,
  target: 'board'
}

export interface TargetOptions {
  everyone?: boolean,
  userId?: string | string[]
}

const targetOptionsSchema = {
  everyone: ['boolean', 'undefined'],
  userId: ['string', 'array', 'undefined'],
}

const defaultTargetOptions: TargetOptions = {
  everyone: true,
  userId: undefined,
}

export function dispatch(effect: EffectType, options: EffectOptions, target: TargetOptions) {
  Misc.validate({ effect }, { effect: 'string' });
  Misc.validate({ ...options }, EffectOptionsSchema);
  Misc.validate({ ...target }, targetOptionsSchema);

  const opts: EffectOptions = {
    ...defaultEffectOptions,
    ...options
  }

  const targ: TargetOptions = {
    ...defaultTargetOptions,
    ...target,
  }

  if (!Array.isArray(targ.userId)) { targ.userId = [targ.userId!] }

  if (targ.everyone) {
    Constants.s?.executeForEveryone(effect, opts);
  } else if (targ.userId != undefined) {
    for (const userId of targ.userId) {
      Constants.s?.executeAsUser(effect, userId, opts);
    }
  }
}

export function registerEffects() {
  Constants.s?.register(EffectType.SHAKE, shake);
  Constants.s?.register(EffectType.PULSATE, pulsate);
  Constants.s?.register(EffectType.SPIN, spin);
}
