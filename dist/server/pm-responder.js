'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var PostMessageResponder = function PostMessageResponder(router) {
    var _this = this;

    _classCallCheck(this, PostMessageResponder);

    this.handleMessage = function (e) {
        var resultPromise = _this.router.handleMessage(e);
        if (!resultPromise) return;

        resultPromise.then(function (result) {
            return { result: result };
        }, function (error) {
            return {
                error: {
                    code: -32000
                }
            };
        }).then(function (response) {
            return _Object$assign({
                jsonrpc: '2.0',
                id: e.data.id
            }, response);
        }).then(function (response) {
            return e.source.postMessage(response, '*');
        });
    };

    this.router = router;
};

exports['default'] = PostMessageResponder;
module.exports = exports['default'];
// message: error.message || error.code || error.name,
// data: util.inspect(error)
