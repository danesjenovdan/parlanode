import fs from 'fs';
import path from 'path';
import glob from 'glob';

const cardNames = glob
  .sync('./cards/**/card.vue')
  .map((file) => file.split('/').slice(-3, -1).join('/'));

const localeNames = glob
  .sync('./cards/_i18n/*/')
  .map((dir) => dir.split('/').slice(-2, -1).join('/'));

let missingLocaleFiles = 0;

localeNames.forEach((localeName) => {
  const defaultsLocaleFile = path.resolve(
    `./cards/_i18n/${localeName}/defaults.yaml`
  );
  if (!fs.existsSync(defaultsLocaleFile)) {
    // eslint-disable-next-line no-console
    console.error(`MISSING LOCALE FILE: ${defaultsLocaleFile}`);
    missingLocaleFiles += 1;
  }

  cardNames.forEach((cardName) => {
    const cardLocaleFile = path.resolve(
      `./cards/_i18n/${localeName}/${cardName}.yaml`
    );
    if (!fs.existsSync(cardLocaleFile)) {
      // eslint-disable-next-line no-console
      console.error(`MISSING LOCALE FILE: ${cardLocaleFile}`);
      missingLocaleFiles += 1;
    }
  });
});

if (missingLocaleFiles > 0) {
  // eslint-disable-next-line no-console
  console.error(`\nMISSING LOCALE FILES: ${missingLocaleFiles}\n`);
  process.exit(1);
} else {
  // eslint-disable-next-line no-console
  console.error(`\nNO MISSING LOCALE FILES\n`);
}
