# Parlanode

This is the card rendering part of the Parlameter project. The purpose of this project is to store the ejs templates along with information about the data source for each card.

It contains both the API (`server`) and the client side CMS(`cms-dev`).

#### Features

##### Server

* Express for server (routing and handling requests)
* Mongoose for interaction with the MongoDB database
* Sequelize for interaction with the postgres for authentication

##### CMS

* AngularJS
* cg-angular (yeoman generator)
* AdminLTE just for CSS (for now, will be deprecated)

## CMS

Working folder for cms is in ```./cms-dev```.

#### Building CMS

In app.js on lin ```44``` comment the remote api link and uncomment the local one

```bash
grunt build
```

Copy content of ./cms-dev/dist to ./cms

#### Deployment

Every merge to master will trigger the webhook that tests and deploys parlanode to production. Success or error messages will be sent to DJND Slack #parladeploy channel.

##### Work in progress

```
$ pm2 deploy ecosystem.config.js production
```

## Caching

Caching is done for each first request to the card route. At that time cards gets rendered and stored into the database. Each subsequent request for the same URL will serve the prerendered card.

#### Example
```
[GET] https://glej.parlameter.si/p/izracunana-prisotnost/9/
```

Each request checks for a corresponding entry in the database according to its full url. If no prerendered card is found it then fetches the data from parlalize and renders the ejs. It then stores the card to `CardRender` collection in mongo with the url as `cardUrl` parameter.
