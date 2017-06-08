# Parlanode

This is the card rendering part of the Parlameter project. It includes the API (`server`) and the client side CMS (`cms-dev`). Because of a recent refactoring effort, available cards are divided into two groups, based on the renderer used to render them.

## ejs (legacy)

Most cards are developed using [ejs](http://ejs.co/) with the source stored in [a separate repo](//github.com/muki/parlacards). After their development is finished, they are compiled and entered into the parlanode database through the CMS, which stores ejs templates along with relevant metadata (name, data source URL, API URL etc.) for each card.

We are in the process of abandoning this format of cards. We encourage any new development to be done using Vue wich allows for more flexibility.

## Vue (new cards)

Newer cards are implemented using [Vue](//vuejs.org/). Instead of being built outside and entered manually through the CMS, these cards exist entirely in the parlanode repo - their sources (and development instructions) are stored in the `cards` folder. They are rendered using [vue-server-renderer](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer)

We intend to eventually port all cards to this format.

#### Features

##### Server

* Express for server (routing and handling requests)
* Mongoose for interaction with the MongoDB database

##### CMS

* AngularJS
* cg-angular (yeoman generator)
* AdminLTE just for CSS (for now, will be deprecated)

## CMS

Working folder for cms is in ```./cms-dev```.

#### Building CMS

In app.js on line ```44``` comment the remote api link and uncomment the local one

```bash
grunt build
```

Copy content of ./cms-dev/dist to ./cms

## Development

#### Word of caution

This chapter concerns the development of the parlanode "backend," meaning the parts of the software that serve cards, take care of their rendering etc. **Not** the development of actual (newer) Vue-cards. Instructions for that can be found in the [README.md file in the `cards` folder](https://github.com/muki/parlanode/tree/master/cards).

#### Requirements

* supervisor `$ yarn global add supervisor` (will auto restart server on code update)

#### Serving

```
$ yarn run dev
```

## Deployment

Every merge to master will trigger the webhook that tests and deploys parlanode to production. Success or error messages will be sent to DJND Slack #parladeploy channel.

## Caching

Caching is done for each first request to the card route. At that time cards gets rendered and stored into the database. Each subsequent request for the same URL will serve the prerendered card.

#### Example
```
[GET] https://glej.parlameter.si/p/izracunana-prisotnost/9/
```

Each request checks for a corresponding entry in the database according to its full url. If no prerendered card is found it then fetches the data from parlalize and renders the card (the specifics of this process differ between ejs and Vue cards). It then stores the rendered card to `CardRender` collection in MongoDB with the url as `cardUrl` parameter.
