import { existsSync, readFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';
import { groupBy, mapValues } from 'lodash-es';

const dir = dirname(fileURLToPath(import.meta.url));
const cardsPath = resolve(dir, '..', 'cards');

export default function serveDevCards() {
  return {
    name: 'serve-dev-cards',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/') {
          const cards = glob
            .sync(join(cardsPath, '**/card.json'))
            .map((file) => file.split('/').slice(-3, -1));
          const cardsByGroup = mapValues(
            groupBy(cards, ([g]) => g),
            (v) => v.map(([, m]) => m)
          );
          const cardRows = Object.entries(cardsByGroup)
            .map(
              ([group, methods]) => `
              <table style="margin: 0 auto; border-collapse: collapse; display: inline-block;">
                ${methods
                  .map(
                    (method) => `
                    <tr>
                      <td style="border: 1px solid black;">${group}</td>
                      <td style="border: 1px solid black;"><a href="/${group}/${method}">${method}</a></td>
                    </tr>`
                  )
                  .join('\n')}
              </table>`
            )
            .join('\n');
          res.end(cardRows);
        } else if (req.url.slice(1).split('/').length === 2) {
          const [group, method] = req.url.slice(1).split('/');
          const cardName = `${group}/${method}`;
          if (existsSync(join(cardsPath, cardName, 'card.json'))) {
            const html = readFileSync(
              resolve(dir, 'card-entry-dev.html'),
              'utf-8'
            )
              .replace(/{cardName}/g, cardName)
              .replace(/{cardEntry}/g, `/${cardName}/card-entry-dev.js`);
            server
              .transformIndexHtml(`${cardsPath}/${cardName}/index.html`, html)
              .then((transformedHtml) => {
                res.end(transformedHtml);
              })
              .catch((error) => res.status(500).send(error));
          } else {
            next();
          }
        } else {
          next();
        }
      });
    },
    resolveId(id) {
      if (id.endsWith('/card-entry-dev.js')) {
        return join(cardsPath, id.slice(1));
      }
      return undefined;
    },
    load(id) {
      if (id.endsWith('/card-entry-dev.js')) {
        const [group, method] = id.split('/').slice(-3, -1);
        const cardName = `${group}/${method}`;
        if (existsSync(join(cardsPath, cardName, 'card.json'))) {
          const entryTemplate = readFileSync(
            resolve(dir, 'card-entry-dev.js'),
            'utf-8'
          );
          return entryTemplate
            .replace(/{cardName}/g, cardName)
            .replace(/{cardLang}/g, process.env.VITE_CARD_LANG || 'sl');
        }
      }
      return undefined;
    },
  };
}
