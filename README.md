# parlacards

Embedable cards for Parlameter.

**TODO: Rename repo to parlacards**

---

# Card development

### Install dependencies

```sh
yarn
```

### Run dev server

This will run on `http://localhost:3000/` by default.

```sh
yarn dev
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
