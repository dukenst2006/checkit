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
npm update

gem install sass
gem install sass-globbing
gem install cssesc

bower prune
bower update

grunt
