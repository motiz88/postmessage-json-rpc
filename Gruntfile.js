/* eslint-env node */

'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            default: {
                options: {
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/**/*.js']
            }
        },
        eslint: {
            default: {
                files: {
                    src: ['src/**/*.js', 'test/**/*.js']
                },
            },
        },
        watch: {
            default: {
                files: ['.eslintrc', 'Gruntfile.js', '<%= eslint.default.files.src %>'],
                tasks: ['force:eslint', 'mochaTest', 'babel']
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
            'default': ["dist"],
            'bak': ["dist/*.bak"]
        },
    });

    grunt.registerTask('test', ['eslint', 'mochaTest']);
    grunt.registerTask('build', ['clean', 'eslint', 'babel']);

    grunt.registerTask('default', 'build');


};