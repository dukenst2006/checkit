env:
	node -e " \
		var fs = require('fs'); \
		var conf = 'define({\"FIREBASE\": \"$$CHECKIT_FIREBASE_URL\"})'; \
		fs.writeFileSync('public/js/config.js', conf); \
	"

web:
	nodemon web.js

worker:
	nodemon worker.js

css:
	node-sass public/css/main.scss public/var/styles.css
	autoprefixer -o public/var/styles.css public/var/styles.css

watch:
	chokidar 'public/js/**/*.scss' 'public/css/**/*.scss' -c 'make css'

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
