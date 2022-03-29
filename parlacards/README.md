# parlacards

Embedable cards for Parlameter.

**TODO: Rename repo to parlacards**

---

# Card development

### Download project

Clone the git repository and run:

```sh
git config submodule.parlassets.branch ljubljana
```
```sh
git submodule update --init --recursive --remote
```

### Install dependencies

```sh
yarn
```

### Run dev server

To develop cards run this command. It will run the card dev server on `http://localhost:3000/` by default.

```sh
yarn dev
```

To develop the server that serves the server-side rendered cards run this command. It will run the server on `http://localhost:7004/` by default. Note that you need to have built the cards with `yarn build` at least once before.

```sh
yarn start:watch
```

### See also:

- [Configuring environment](./docs/configuring-local-env.md)
- [Developing with a local version of `parlassets`](./docs/developing-parlassets.md)
- [More on how cards work](./docs/how-cards-work.md)


---

# Build and run production server

### Install dependencies

```sh
yarn
```

### Build

This will build:
- client js
- server bundles needed for SSR
- locale markdown files

```sh
yarn build
```

### Run server

This runs the production server that will render and serve built cards.

```sh
yarn start
```
