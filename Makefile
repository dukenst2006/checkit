.PHONY: env web worker

env:
	node -e " \
		var fs = require('fs'); \
		require('dotenv').load({ path: 'config/env' }); \
		var conf = 'define({\"FIREBASE\": \"' + process.env.CHECKIT_FIREBASE_URL + '\"})'; \
		fs.writeFileSync('public/js/config.js', conf); \
	"

css:
	node-sass public/css/main.scss public/dist/styles.css
	autoprefixer-cli -o public/dist/styles.css public/dist/styles.css

examples:
	../checkit-www/convert.js
	cp ../checkit-www/dist/examples.js ./public/dist/

build:
	r.js -o config/build.js

watch:
	chokidar 'public/css/**/*.scss' -c 'make css'

start_web:
	nodemon web.js

start_worker:
	nodemon worker.js

test_worker:
	mocha worker/*.test.js --require worker.js --timeout 5000

test_security:
	mocha security.test.js --timeout 5000

test_chrome:
	node worker.js &
	karma start config/karma.conf.js --single-run --browsers Chrome
	-pkill -f "node worker.js"

test_ff:
	node worker.js &
	karma start config/karma.conf.js --single-run --browsers Firefox
	-pkill -f "node worker.js"
