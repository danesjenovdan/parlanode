# parlanode
parlanode

TODO - Automate the process below 

## CMS

Working folder for cms is in ```./cms-dev```.

#### Building CMS

In app.js on lin ```44``` comment the remote api link and uncomment the local one

```
$ grunt build
```

Copy content of ./cms-dev/dist to ./cms

#### Deploy

*There is an issue with continuous deployment, at the moment server requires manual pull/fetch and restart from the `parlanode/current` folder*
```
$ git pull origin master
```
```
$ pm2 restart run
```
```
$ pm2 deploy ecosystem.json production
```

## Caching

Caching is done for each first request to the card route. At that time cards gets rendered and stored into the database. Each subsequent request for the same URL will serve the prerendered card.

#### Example
```
[GET] https://glej.parlameter.si/p/izracunana-prisotnost/9/
```

Each request checks for a corresponding entry in the database according to its full url. If no prerendered card is found it then fetches the data from parlalize and renders the ejs. It then stores the card to `CardRender` collection in mongo with the url as `cardUrl` parameter.

