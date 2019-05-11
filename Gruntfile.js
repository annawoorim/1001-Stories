'use strict';
var packagejson = require('./package.json');

module.exports = function (grunt) {
 
  // Configuration

  grunt.initConfig({
    pkg: packagejson,
    "curl-dir": {
      "staging": [
        "https://unpkg.com/leaflet@1.3.4/dist/leaflet.js",
        "https://unpkg.com/esri-leaflet@2.2.3/dist/esri-leaflet.js",
        "https://unpkg.com/leaflet@1.3.4/dist/leaflet.css",
        "https://unpkg.com/mapbox-gl@0.44.1/dist/mapbox-gl.js",
        "https://unpkg.com/mapbox-gl@0.44.1/dist/mapbox-gl.css",
        "https://unpkg.com/esri-leaflet-vector@1.0.7/dist/esri-leaflet-vector.js",
        "https://unpkg.com/leaflet-easybutton@2.0.0/src/easy-button.js",
        "https://unpkg.com/leaflet-easybutton@2.0.0/src/easy-button.css"
      ]
    },    
    jshint: {
      build: [
        'js/*.js'
      ],
      options: {jshintrc: '.jshintrc', ignores:[]}
    },
    uglify: {
      dist: {
        files: {
          'dist/app.min.js': [
            "staging/leaflet.js",
            "staging/esri-leaflet.js", /* note: order seems to matter */
            "staging/mapbox-gl.js",
            "staging/esri-leaflet-vector.js",
            "lib/leaflet-extra-markers/js/leaflet.extra-markers.min.js",
            "staging/easy-button.js",
            "js/*.js",
            "!js/SocialButtonBar.js"
          ]
        }
      }
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          "dist/app.min.css": [
            "staging/leaflet.css",
            "staging/mapbox-gl.css",
            "lib/leaflet-extra-markers/css/leaflet.extra-markers.min.css",
            "staging/easy-button.css", 
            "css/main.css"
          ]
        }
      }
    },    
    watch: {
      compile: {
        files: ['*.html','js/*.js','lib/**/*.js',"css/main.css"],
        tasks: ["jshint"],
        options: {
          debounceDelay: 250,
          livereload: true
        }        
      },
      deploy: {
        files: ["dist/app.min.js"],
        options: {
          debounceDelay: 250,
          livereload: true
        }        
      }
    }        
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks('grunt-curl');

  grunt.registerTask("default", ["jshint", "watch:compile"]);
  
};