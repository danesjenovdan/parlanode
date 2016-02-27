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

```
$ pm2 deploy ecosystem.json production
```

