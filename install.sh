#!/bin/bash

# copy config files
for exFile in config/*.example
do
  [ -f ${exFile/\.example/} ] || cp "$exFile" "${exFile/\.example/}"
done

npm install -g bower
npm install -g karma
npm install -g autoprefixer
npm install -g chokidar-cli
npm update

bower prune
bower update

make css
