# Developing with a local version of `parlassets`

By default when running the dev server the styles are loaded from the url specified in the `VITE_PARLASSETS_URL` environment variable (see [`.env`](../.env)).

This means that if you make changes to `parlassets` they may not always be visible. Changes to things like images, icons, and  `.scss` files that are directly included will usually be detected, but the compiled version of `style.css` and other files accessed via the url will still be loaded from the external `VITE_PARLASSETS_URL`.

If you want to develop with a local version of `parlassets` follow these steps:

- Set the `VITE_PARLASSETS_URL` environment variable. (see [Configuring environment](./configuring-local-env.md))
```
VITE_PARLASSETS_URL=http://localhost:8080
```
- In the [`parlassets`](../parlassets) directory
```sh
cd parlassets
```
- Check out the branch you want to work on
```sh
git checkout dev
```
- Run the command that will watch and build the css
```sh
yarn dev
```
- In another terminal, run the command will serve the files
```sh
yarn serve
```
