(function() {
  "use strict";

  var LIVERELOAD_PORT = 35729;
  var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
  var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  module.exports = function (grunt) {
  // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
      watch: {
        options: {
          nospawn: true,
          livereload: LIVERELOAD_PORT
        },
        scripts: {
          files: ['assets/javascripts/**/*.js', 'test/*Spec.js'],
          tasks: ['test', 'uglify']
        },
        css: { // watch all .scss files and call the sass task to convert them to .css
          files: 'assets/stylesheets/*.scss',
          tasks: ['sass', 'cssmin']
        },
        livereload: {
          files: [
            'index.html',
            'assets/stylesheets/*.css', // reload converted .css file
            'assets/javascripts/*.js'
          ]
        }
      },
      connect: {
        options: {
          port: 9000,
          hostname: 'localhost'
        },
        livereload: {
          options: {
            middleware: function (connect) {
              return [
                lrSnippet,
                mountFolder(connect, '.')
              ];
            }
          }
        }
      },
      open: {
        server: {
          path: 'http://localhost:<%= connect.options.port %>'
        }
      },
      sass: {
        dist: {
          options: {
            style: 'expanded'
          },
          files: {
            'assets/stylesheets/css/main.css': 'assets/stylesheets/scss/style.scss',
          }
        }
      },
      cssmin: {
        combine: {
          files: {
            'assets/stylesheets/css/min/main.min.css': [ 
              'bower_components/bootstrap/dist/css/bootstrap.min.css',
              'assets/stylesheets/css/*.css'
            ]
          }
        }
      },
      jasmine: {
        pivotal: {
          src: 'assets/javascripts/**/*.js',
          options: {
            specs: 'test/*Spec.js',
            helpers: 'test/*Helper.js'
          }
        }
      },
      jshint: {
        all: ['Gruntfile.js', 'assets/javascripts/**/*.js', 'test/**/*.js']
      },
      concat: {
        options: {
          separator: ";"
        },
        dist: {
          src: [
                'assets/javascripts/**/*.js'
              ],
          dest: 'assets/javascripts/main.js'
        }
      },
      uglify: {
        options: {
          compress: {
            drop_console: true
          }
        },
        my_target: {
          files: {
            'assets/javascripts/min/main.min.js': ['assets/javascripts/main.js']
          }
        }
      }
    });

    grunt.registerTask('test', ['jasmine', 'jshint']);
    grunt.registerTask('serve', ['test', 'sass', 'concat', 'uglify', 'cssmin', 'connect:livereload', 'open', 'watch']);
    grunt.registerTask('s', ['serve']);
    
  };
})();