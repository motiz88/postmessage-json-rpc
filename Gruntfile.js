/* eslint-env node */

'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            default: {
                files: {
                    src: ['src/**/*.js', 'test/**/*.js']
                },
            },
        },
        karma: {
            once: {
                configFile: 'karma.conf.js',
                singleRun: true,
            },
            ci: {
                configFile: 'karma.ci.conf.js',
            }
        },
        watch: {
            default: {
                files: ['**/.eslintrc', 'Gruntfile.js', '<%= eslint.default.files.src %>'],
                tasks: ['eslint', 'karma:once', 'babel']
            },
        },
        babel: {
            default: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'dist',
                    ext: '.js'
                }]
            },
        },
        clean: {
            'default': ["dist"]
        },
    });

    grunt.registerTask('test', ['eslint', 'karma:once']);
    grunt.registerTask('test:ci', ['eslint', 'karma:ci']);
    grunt.registerTask('build', ['clean', 'eslint', 'babel']);

    grunt.registerTask('default', 'build');


};