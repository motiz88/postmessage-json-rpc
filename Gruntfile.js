/* eslint-env node */

'use strict';

var path = require('path');

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
            doc: {
                files: ['package.json', 'README.md', 'jsdoc.conf.json', 'Gruntfile.js', '<%= eslint.default.files.src %>'],
                tasks: ['jsdoc'],
                options: {
                    livereload: true
                }
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
            'default': ['dist']
        },
        jsdoc: {
            default: {
                src: [],
                jsdoc: path.join(__dirname, 'node_modules', '.bin', 'jsdoc'),
                options: {
                    configure: 'jsdoc.conf.json'
                }
            }
        },
        connect: {
            serveDocs: {
                options: {
                    useAvailablePort: true,
                    base: 'doc',
                    open: true,
                    livereload: true,
                }
            }
        }
    });

    grunt.registerTask('test', ['eslint', 'karma:once']);
    grunt.registerTask('test:ci', ['eslint', 'karma:ci']);
    grunt.registerTask('build', ['clean', 'eslint', 'babel']);
    grunt.registerTask('serve-docs', ['connect:serveDocs', 'jsdoc', 'watch:doc']);

    grunt.registerTask('default', 'build');


};