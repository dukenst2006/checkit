.PHONY: env web worker

env:
	# export $$(cat config/env | xargs)
	node -e " \
		var fs = require('fs'); \
		var conf = 'define({\"FIREBASE\": \"$$CHECKIT_FIREBASE_URL\"})'; \
		fs.writeFileSync('public/js/config.js', conf); \
	"

css:
	node-sass public/css/main.scss public/var/styles.css
	autoprefixer-cli -o public/var/styles.css public/var/styles.css

build:
	r.js -o build.js

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
