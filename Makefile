css:
	node-sass public/css/main.scss public/var/styles.css
	autoprefixer -o public/var/styles.css public/var/styles.css

watch:
	chokidar 'public/js/**/*.scss' 'public/css/**/*.scss' -c 'make css'

test_chrome:
	karma start config/karma.conf.js --single-run --browsers Chrome

test_ff:
	karma start config/karma.conf.js --single-run --browsers Firefox
