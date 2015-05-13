#!/bin/bash

# copy config files
for exFile in config/*.example
do
  [ -f ${exFile/\.example/} ] || cp "$exFile" "${exFile/\.example/}"
done

sh env.sh

npm install -g bower
npm install -g karma-cli
npm install -g node-sass@v2.1.1
npm install -g autoprefixer
npm install -g chokidar-cli
npm update

bower prune
bower update

make css
