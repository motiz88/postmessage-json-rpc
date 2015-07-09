var baseconf = require('./karma.conf');
var path = require('path');

module.exports = function(config) {
    baseconf(config);
    config.set({
        reporters: ['nested', 'coverage', 'coveralls'],
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },
        captureTimeout: 300000,
        browsers: ['PhantomJS', 'Firefox'],
        singleRun: true
    });
};