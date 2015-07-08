'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var PostMessageRouter = function PostMessageRouter(handlers) {
    var _this = this;

    _classCallCheck(this, PostMessageRouter);

    this.handleMessage = function (e) {
        if (!e.data || !e.data.method) {
            // ignore obviously invalid messages: they're not for us
            return undefined;
        }
        var func = _this.handlers[e.data.method];
        if (typeof func !== 'function') throw new Error('No handler found for method \'' + e.data.method + '\'');
        try {
            var retval = func.call.apply(func, [_this.handlers].concat(_toConsumableArray(e.data.params || [])));
            if (typeof e.data.id === 'undefined') return undefined;
            if (typeof retval === 'object' && retval && typeof retval.then === 'function') // it's a promise!
                return retval;
            return _Promise.resolve(retval);
        } catch (er) {
            return _Promise.reject(er);
        }
    };

    this.handlers = handlers;
    if (!this.handlers || typeof this.handlers !== 'object') this.handlers = {};
};

exports['default'] = PostMessageRouter;
module.exports = exports['default'];
