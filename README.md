# Parlanode

This is the card rendering part of the Parlameter project.

Cards are implemented using [Vue](https://vuejs.org/). Their sources (and development instructions) are stored in the `cards` folder. They are rendered using [vue-server-renderer](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer)

#### Server

* Express for server (routing and handling requests)
* Mongoose for interaction with the MongoDB database

## Development

#### Word of caution

This readme concerns the development of the parlanode "backend", meaning the part that builds, renders, and serves cards and **NOT** the development of actual cards. Those instructions can be found in the [README.md file in the `cards` folder](cards/README.md).

#### Serving

```
$ yarn run dev
```

## Deployment

Every merge to master will trigger the webhook that tests and deploys parlanode to production. Success or error messages will be sent to DJND Slack #parladeploy channel.

## Building & Caching

For each request to the card route the server checks if the card exists and builds the Vue bundles if they are not built. If no prerendered card is found it then fetches the data from parlalize and renders the card. After the card is rendered, the result stored to MongoDB for caching. Each subsequent request with the same card parameters will serve the prerendered card from cache.

#### Example
```
[GET] https://glej.parlameter.si/p/izracunana-prisotnost/9/
```
