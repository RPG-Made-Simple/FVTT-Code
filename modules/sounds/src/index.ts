import { Constants } from "./constants"
import { PageFlipEntry } from "./database/actions/pageFlip";
import { PaperTearEntry } from "./database/actions/paperTear";
import { CoinBagEntry } from "./database/objects/coinBag";
import { CoinsEntry } from "./database/objects/coins";
import { CrystalEntry } from "./database/objects/crystal";

const database = {
  actions: {
    paperTear: PaperTearEntry,
    pageFlip: PageFlipEntry,
  },
  objects: {
    coinBag: CoinBagEntry,
    coins: CoinsEntry,
    crystal: CrystalEntry,
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
  Sequencer.Database.registerEntries(Constants.id, database);
})
