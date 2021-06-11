#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

# BUILD AND PUBLISH parlassets-ljubljana
sudo docker build -f Dockerfile -t parlassets-ljubljana:latest .
sudo docker tag parlassets-ljubljana:latest rg.fr-par.scw.cloud/djnd/parlassets-ljubljana:latest
sudo docker push rg.fr-par.scw.cloud/djnd/parlassets-ljubljana:latest
