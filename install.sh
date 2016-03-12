#!/bin/bash

# copy config files
for exFile in config/*.example
do
  [ -f ${exFile/\.example/} ] || cp "$exFile" "${exFile/\.example/}"
done

npm install -g bower
npm install -g nodemon
npm install -g karma-cli
npm install -g node-sass
npm install -g autoprefixer-cli
npm install -g chokidar-cli
npm install -g mocha
npm update

bower prune
bower update

make env
make css
