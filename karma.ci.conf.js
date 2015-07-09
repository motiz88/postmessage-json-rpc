var baseconf = require('./karma.conf');
var path = require('path');

module.exports = function(config) {
    baseconf(config);
    config.set({
        captureTimeout: 300000,
        browsers: ['PhantomJS', 'Firefox'],
        singleRun: true
    });
};