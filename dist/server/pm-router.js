'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var PostMessageRouter = function PostMessageRouter(handlers, defaultHandler) {
    var _this = this;

    _classCallCheck(this, PostMessageRouter);

    this.handleMessage = function (e) {
        if (!e.data || !e.data.method || !e.data.jsonrpc || e.data.error || 'result' in e) return undefined;
        var func = _this.handlers[e.data.method];
        if (typeof func !== 'function') return _this.defaultHandler(e);

        var invokeHandler = function invokeHandler() {
            var result = func.call.apply(func, [_this.handlers].concat(_toConsumableArray(e.data.params || [])));
            return result;
        };

        if (typeof e.data.id === 'undefined') {
            invokeHandler();
            return undefined;
        }
        return new _Promise(function (resolve) {
            resolve(invokeHandler());
        });
    };

    this.handlers = handlers;
    if (!this.handlers || typeof this.handlers !== 'object') this.handlers = {};
    this.defaultHandler = defaultHandler || function (e) {
        throw new Error('No handler found for method \'' + e.data.method + '\'');
    };
};

exports['default'] = PostMessageRouter;
module.exports = exports['default'];
