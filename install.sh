#!/bin/bash

# copy config files
for exFile in config/*.example
do
  echo "cp $exFile ${exFile/\.example/}"
  [ -f ${exFile/\.example/} ] || cp "$exFile" "${exFile/\.example/}"
done

npm install -g bower
npm install -g nodemon
npm install -g karma-cli
npm install -g node-sass
npm install -g autoprefixer-cli
npm install -g chokidar-cli
npm install -g requirejs
npm install -g mocha

bower install
bower update
bower prune

npm install
npm update
npm prune

make css
make env
make build
