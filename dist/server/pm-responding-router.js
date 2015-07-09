'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _bind = require('babel-runtime/helpers/bind')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _pmResponder = require('./pm-responder');

var _pmResponder2 = _interopRequireDefault(_pmResponder);

var _pmRouter = require('./pm-router');

var _pmRouter2 = _interopRequireDefault(_pmRouter);

var PostMessageRespondingRouter = function PostMessageRespondingRouter() {
    _classCallCheck(this, PostMessageRespondingRouter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    this._router = new (_bind.apply(_pmRouter2['default'], [null].concat(_toConsumableArray(args))))();
    this._responder = new _pmResponder2['default'](this._router);
    this.handleMessage = this._responder.handleMessage;
};

exports['default'] = PostMessageRespondingRouter;
module.exports = exports['default'];
