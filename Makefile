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
	env CHECKIT_IS_TESTING=true mocha worker/*.test.js --require worker.js --timeout 5000

test_chrome:
	env CHECKIT_IS_TESTING=true node worker.js &
	karma start config/karma.conf.js --single-run --browsers Chrome
	pkill -f "node worker.js" || true

test_ff:
	env CHECKIT_IS_TESTING=true node worker.js &
	karma start config/karma.conf.js --single-run --browsers Firefox
	pkill -f "node worker.js"
