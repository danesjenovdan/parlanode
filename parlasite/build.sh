#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

# BUILD AND PUBLISH PRAVNA MREZA
sudo docker build -f Dockerfile -t parlasite:latest .
sudo docker tag parlasite:latest rg.fr-par.scw.cloud/djnd/parlasite:latest
sudo docker push rg.fr-par.scw.cloud/djnd/parlasite:latest
