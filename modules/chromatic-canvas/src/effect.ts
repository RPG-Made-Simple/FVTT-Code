import { getGame } from "@rpgmadesimple/utils/src/misc";
import { Constants } from "./constants";
import { Misc } from "@rpgmadesimple/utils";

enum EffectType {
  SHAKE = 'shake'
}

interface EffectOptions {
  intensity: number,
  duration: number,
  iterations: number,
  target: string | string[],
}

const EffectOptionsSchema = {
  intensity: 'number',
  duration: 'number',
  iterations: 'number',
  target: ['string', 'array'],
}

const defaultEffectOptions: EffectOptions = {
  intensity: 1,
  duration: 500,
  iterations: 1,
  target: 'board'
}

interface TargetOptions {
  everyone?: boolean,
  userId?: string | string[]
}

const targetOptionsSchema = {
  everyone: ['boolean', 'undefined'],
  userId: ['string', 'array'],
}

export function dispatch(effect: EffectType, options: EffectOptions, target: TargetOptions) {
  Misc.validate({ effect }, { effect: 'string' });
  Misc.validate({ ...options }, EffectOptionsSchema);
  Misc.validate({ ...target }, targetOptionsSchema);

  if (!Array.isArray(target.userId)) { target.userId = [target.userId!] }

  const opts: EffectOptions = {
    ...defaultEffectOptions,
    ...options
  }

  if (target.everyone) {
    Constants.s?.executeForEveryone(effect, options);
  } else {
    for (const userId of target.userId) {
      Constants.s?.executeAsUser(effect, userId, options);
    }
  }
}
