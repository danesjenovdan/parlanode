# Parlameter frontend

## Developing with docker-compose

```sh
docker-compose up
```

Running docker compose will:
- start a `parlacards` dev server on port `3000`
- serve `parlasite` on port `3066`
- serve `parlassets` on port `8080`

**If cards, static files (css, js, ...) or something doesn't load you may need to change evironment variables in docker-compose.yaml or parlasite/config/index.js with correct urls!**

_TODO: fix parlasite to not use config and move everything to environment variables that can be changed in docker-compose and/or k8s build files. This work is currently ongoing on branch `dev-parlasite-esm`_

## Developing parlacards

See [parlacards/README.md](./parlacards/README.md)

## Developing parlasite

See [parlasite/README.md](./parlasite/README.md)

## Developing parlassets

See [parlassets/README.md](./parlassets/README.md)
