#!/bin/bash

# set value to env variable CHECKIT_FIREBASE_URL
sed -i '' -e 's#^.*\(FIREBASE*:*\).*$#\1"'$CHECKIT_FIREBASE_URL'"#' public/js/config.js
