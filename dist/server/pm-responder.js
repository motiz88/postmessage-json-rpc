'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
function toResponse(promise, id) {
    return promise.then(function (result) {
        return {
            jsonrpc: '2.0',
            result: result,
            id: id
        };
    }, function (error) {
        return {
            jsonrpc: '2.0',
            error: _Object$assign({}, error),
            id: id
        };
    });
}

var PostMessageResponder = function PostMessageResponder(router) {
    var _this = this;

    _classCallCheck(this, PostMessageResponder);

    this.handleMessage = function (e) {
        var result = _this.router.handleMessage(e);
        if (!result) return;
        toResponse(result, e.data.id).then(function (response) {
            e.source.postMessage(response, e.origin);
        });
    };

    this.router = router;
};

exports['default'] = PostMessageResponder;
module.exports = exports['default'];
