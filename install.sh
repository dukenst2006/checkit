#!/bin/bash

# copy config files
for exFile in config/*.example
do
  [ -f ${exFile/\.example/} ] || cp "$exFile" "${exFile/\.example/}"
done

npm install -g bower
npm install -g grunt
npm install -g grunt-cli
npm install -g nodemon
npm install -g chokidar-cli
npm update

bower prune
bower update

brew install sassc

grunt
