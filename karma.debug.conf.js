var baseconf = require('./karma.conf');
var path = require('path');

module.exports = function(config) {
    baseconf(config);
    config.set({
        webpack: {
            module: {
                preLoaders: [{
                    test: /\.jsx?$/,
                    include: path.resolve('src/'),
                    loader: "babel",
                }, {
                    test: /\.jsx?$/,
                    include: path.resolve('test/'),
                    loader: "babel",
                }, ],
            },
            watch: true,
            devtool: 'eval-source-map',
        },
    });
}