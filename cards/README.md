# Cards

This folder stores complete sources and information for cards that are developed using [Vue](https://vuejs.org/) and rendered with [Vue SSR](https://vuejs.org/v2/guide/ssr.html). Those sources are compiled into webpack bundles, which are in turn used to render cards using vue-server-renderer.

## File/folder organization

Cards are stored in (sub)directories that correspond to their group/method in the API request. E.g. if the request is `https://glej.parlameter.si/s/seznam-sej/`, all card files will be stored in the subfolder `s/seznam-sej`. That folder contains the following files:

- `card.json` - card metadata such as name, data source URL and time of last update.
- `card.vue` - source code of the card, implemented as a Vue component (.vue is a [single file component](https://vuejs.org/v2/guide/single-file-components.html) format that stores the template, styling and logic in the same file)
- `data.json` - sample response of the card's data URL, used as data source instead of real API during development
- `state.json` - sample state object, used for simulation purposes during development (in production, state object is passed as a URL parameter)

## Commands

Start dev server for specified card and launch browser
- `yarn run cards <path-to-card>` or
- `yarn run cards <path-to-card> dev`

Build client and server bundles for specified card
- `yarn run cards <path-to-card> build`

Run dev server or build the card with specified language (default: sl)
- `yarn run cards <path-to-card> dev <lang>`
- `yarn run cards <path-to-card> build <lang>`

Start card generation wizard
- `yarn run cards-generate`

## (Re)building the card on the server

After you're finished making changes run the build command to generate client and server bundles locally. If the process finished successfully it will update the timestamp in `card.json`. This timestamp will tell the server that the card was changed and should be rebuilt.
