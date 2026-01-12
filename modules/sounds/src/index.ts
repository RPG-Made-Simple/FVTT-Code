import { Constants } from "./constants"
import { CoinBagEntry } from "./database/objects/coinBag";

const database = {
  objects: {
    coinBag: CoinBagEntry,
  }
};

const addPrefix = (obj: any, prefix: string) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      if (obj[key].endsWith('.ogg')) {
        obj[key] = prefix + obj[key];
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      addPrefix(obj[key], prefix);
    }
  }
}

Hooks.once('sequencerReady', () => {
  const prefix = `modules/${Constants.id}/assets/`;
  addPrefix(database, prefix);

  // @ts-ignore
  Sequencer.Database.registerEntries(Constants.name, database);
})
