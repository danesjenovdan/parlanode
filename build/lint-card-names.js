import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { camelCase, upperFirst } from 'lodash-es';

const cardNames = glob
  .sync('./cards/**/card.vue')
  .map((file) => file.split('/').slice(-3, -1).join('/'));

let missingCardComponentNames = 0;
let wrongCardComponentNames = 0;

cardNames.forEach((cardName) => {
  const correctComponentName = `Card${upperFirst(camelCase(cardName))}`;
  const cardFile = path.resolve(`./cards/${cardName}/card.vue`);
  const cardFileText = fs.readFileSync(cardFile, 'utf-8');
  const match = cardFileText.match(/\s{2}name:\s'(?<name>.*)',/);
  if (match?.groups?.name) {
    if (match.groups.name !== correctComponentName) {
      // eslint-disable-next-line no-console
      console.error(
        `WRONG CARD COMPONENT NAME "${match.groups.name}" !== "${correctComponentName}": ${cardFile}`
      );
      wrongCardComponentNames += 1;
    }
  } else {
    // eslint-disable-next-line no-console
    console.error(`MISSING CARD COMPONENT NAME: ${cardFile}`);
    missingCardComponentNames += 1;
  }
});

const allErrors = missingCardComponentNames + wrongCardComponentNames;

if (allErrors > 0) {
  // eslint-disable-next-line no-console
  console.error(`\nCARD COMPONENT NAME ERORRS: ${allErrors}\n`);
  process.exit(1);
} else {
  // eslint-disable-next-line no-console
  console.error(`\nNO CARD COMPONENT NAME ERORRS\n`);
}
