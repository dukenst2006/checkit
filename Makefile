css:
	sassc public/css/main.scss >! public/var/styles.css

watch:
	chokidar 'public/js/**/*.scss' 'public/css/**/*.scss' -c 'time make css'
