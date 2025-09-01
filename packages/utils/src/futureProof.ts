import { versionSwitchBehavior } from "./misc";

/**
 * Wrapper to get CanvasAnimation.
 * @returns The CanvasAnimation class.
 */
export function getCanvasAnimation(): typeof CanvasAnimation {
  return versionSwitchBehavior({
    v13: () => {
      // @ts-ignore
      return foundry.canvas.animation.CanvasAnimation;
    }
  })
}

/**
 * Wrapper to get game.
 * @returns The game instance.
 * @throws If the game is not yet initialized.
 */
// @ts-ignore
import Game = foundry.Game;
export function getGame(): Game {
  if(!(game instanceof Game)) {
    throw new Error('game is not initialized yet!');
  }
  return game;
}
