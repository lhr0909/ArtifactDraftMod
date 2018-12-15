const os = require('os');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const axios = require('axios');
const _ = require('lodash');
const util = require('util');
const VDF = require('@node-steam/vdf');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const globAsync = util.promisify(glob);

const DRAWTWO_ROOT = 'https://api.drawtwo.gg/api/cards';
const ITEMS_LIST = `${DRAWTWO_ROOT}/items`;
const HEROES_LIST = `${DRAWTWO_ROOT}/heroes`;
const MAIN_LIST = `${DRAWTWO_ROOT}/main`;

// tiers mapping
const DRAWTWO_TIERS = {
  6: 'S',
  5: 'A',
  4: 'B',
  3: 'C',
  2: 'D',
  1: 'F',
  0: 'U',
};

const ARTIFACT_PATH_MAC = `${os.homedir()}/Library/Application\ Support/Steam/steamapps/common/Artifact/game/dcg/resource`;

const BACKUP_PATH = `${process.cwd()}/original`;
const GENERATED_PATH = `${process.cwd()}/generated`;

async function main(source, destination) {
  // find all card sets
  const cardSetFiles = await globAsync('card_set_*.txt', {
    cwd: source,
    nodir: true,
  });

  //read all card texts
  const cardSets = await Promise.all(cardSetFiles.map(
    file => readFileAsync(
      path.resolve(source, file), { encoding: 'utf8' }
    ).then(text => VDF.parse(text)),
  ));

  // read drawtwo lists
  console.log('reading drawtwo data');
  const { data: items } = await axios(ITEMS_LIST);
  const { data: heroes } = await axios(HEROES_LIST);
  const { data: mainCards } = await axios(MAIN_LIST);

  const cards = items.concat(heroes).concat(mainCards);

  // use simple for-loops for others to easily read/learn, I can go crazier than this
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const cardId = card.game_id;

    console.log('adding draft info for ' + card.name);

    // skip if there is no draft info
    if (!card.draft) {
      continue;
    }

    const { tier, tier_position: position } = card.draft;

    for (let j = 0; j < cardSets.length; j++) {
      const cardSet = cardSets[j];
      console.log('updating ' + cardSetFiles[j]);

      // see if there is actually this card
      const cardName = _.get(cardSet, `lang.Tokens.CardName_${cardId}`);

      if (!cardName) {
        console.error(`could not find card name with id ${cardId}`);
        continue;
      }

      _.set(cardSet, `lang.Tokens.CardName_${cardId}`, `[${DRAWTWO_TIERS[tier]}${position}] ${cardName}`);
    }
  }

  await Promise.all(cardSetFiles.map(
    (fileName, i) => writeFileAsync(path.resolve(destination, fileName), VDF.stringify(cardSets[i]))
  ));

  return 'done!';
}


if (require.main === module) {
  return main(BACKUP_PATH, GENERATED_PATH)
    .then(obj => console.log(obj))
    .catch(err => console.error(err));
}