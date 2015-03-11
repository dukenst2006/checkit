/*global module:false*/
module.exports = function(grunt) {

  var FILES = {
    javascripts:  ['public/js/**/*.js'],
    stylesheets:  ['public/css/**/*.scss', 'public/js/**/*.scss'],
    templates:    ['public/js/**/*.html'],
    e2e_tests:    ['public/js/modules/**/*.e2e.js'],
  };

  grunt.initConfig({

    watch: {
      options: { livereload: true, interupt: true },
      html: { files: FILES.templates },
      js:   { files: FILES.javascripts, tasks: ['js'] },
      css:  { files: FILES.stylesheets, tasks: ['css'] },
      e2e:  { files: FILES.e2e_tests, tasks: ['karma:e2e'] }
    },

    karma: {
      options: {
        configFile: 'config/karma.conf.js',
        singleRun: true,
        reportSlowerThan: 5000
      },

      // singleRun
      run:      { browsers: ['Chrome', 'Firefox', 'PhantomJS'] },
      phantom:  { browsers: ['PhantomJS'] },
      chrome:   { browsers: ['Chrome'] },
      firefox:  { browsers: ['Firefox'] },

      // watch
      phantomW: { browsers: ['PhantomJS'], singleRun: false },
      chromeW:  { browsers: ['Chrome'], singleRun: false },
      firefoxW: { browsers: ['Firefox'], singleRun: false }
    },

    sass: {
      options: {
        quiet: true,
        require: ['sass-globbing', './public/css/sass_extensions.rb'],
        loadPath: ['public/js', 'public/css'],
        style: 'compressed'
      },
      app: {
        files: { 'public/var/styles.css': 'public/css/main.scss' }
      }
    },

    jshint: {
      src: FILES.javascripts,
      options: { jshintrc: true }
    },

    autoprefixer: {
      app: {
        src: 'public/var/styles.css',
        dest: 'public/var/',
        flatten: true,
        expand: true,
      }
    }

  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['css', 'js']);
  grunt.registerTask('js', []);
  grunt.registerTask('css', ['sass', 'autoprefixer']);
  grunt.registerTask('test', ['karma:run']);
};
