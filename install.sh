#!/bin/bash

# copy config files
for exFile in config/*.example
do
  [ -f ${exFile/\.example/} ] || cp "$exFile" "${exFile/\.example/}"
done

ls -alh
echo '--------'
sh env.sh
echo '--------'

# set value to env variable CHECKIT_FIREBASE_URL
sed -i '' -e 's#^.*\(FIREBASE*:*\).*$#\1"'$CHECKIT_FIREBASE_URL'"#' public/js/config.js

npm install -g bower
npm install -g karma-cli
npm install -g node-sass@v2.1.1
npm install -g autoprefixer
npm install -g chokidar-cli
npm update

bower prune
bower update

make css
