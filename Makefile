.PHONY: examples worker

env:
	node -e " \
		var fs = require('fs'); \
		require('dotenv').load({ path: 'config/env' }); \
		var conf = 'define({\"FIREBASE\": \"' + process.env.CHECKIT_FIREBASE_URL + '\"})'; \
		fs.writeFileSync('app/js/config.js', conf); \
	"

css:
	node-sass app/css/main.scss app/dist/styles.css
	autoprefixer-cli -o app/dist/styles.css app/dist/styles.css
	lessc www/css/base.less | autoprefixer-cli -o www/dist/styles.css

examples:
	node scripts/convert-examples.js app
	node scripts/convert-examples.js www

build:
	r.js -o config/build.js

watch:
	make css
	chokidar 'app/css/**/*.scss' 'www/css/**/*.less' -c 'make css'

start_worker:
	nodemon scripts/worker.js

publish:
	git checkout master
	make css
	make examples
	git add -f www/dist/
	-git commit -m "publish"
	# git push origin `git subtree split --prefix www master`:gh-pages --force
	git subtree push --prefix www origin gh-pages

test_worker:
	mocha worker/*.test.js --require scripts/worker.js --timeout 5000

test_security:
	mocha security.test.js --timeout 5000

test_chrome:
	node scripts/worker.js &
	karma start config/karma.conf.js --single-run --browsers Chrome
	-pkill -f "node scripts/worker.js"

test_ff:
	node scripts/worker.js &
	karma start config/karma.conf.js --single-run --browsers Firefox
	-pkill -f "node scripts/worker.js"
