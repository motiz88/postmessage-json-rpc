'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _pmResponder = require('./pm-responder');

var _pmResponder2 = _interopRequireDefault(_pmResponder);

var _pmRouter = require('./pm-router');

var _pmRouter2 = _interopRequireDefault(_pmRouter);

var PostMessageRespondingRouter = (function (_PostMessageRouter) {
    function PostMessageRespondingRouter() {
        _classCallCheck(this, PostMessageRespondingRouter);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(PostMessageRespondingRouter.prototype), 'constructor', this).apply(this, args);
        this.handleMessage = this._responder.handleMessage;
        this._responder = new _pmResponder2['default'](this);
    }

    _inherits(PostMessageRespondingRouter, _PostMessageRouter);

    return PostMessageRespondingRouter;
})(_pmRouter2['default']);

exports['default'] = PostMessageRespondingRouter;
module.exports = exports['default'];
