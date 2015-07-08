/* eslint-env browser */

'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _pmRouterJs = require('./pm-router.js');

var _pmRouterJs2 = _interopRequireDefault(_pmRouterJs);

var PostMessageRpcServer = (function (_PostMessageRespondingRouter) {
    function PostMessageRpcServer() {
        _classCallCheck(this, PostMessageRpcServer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(PostMessageRpcServer.prototype), 'constructor', this).apply(this, args);
    }

    _inherits(PostMessageRpcServer, _PostMessageRespondingRouter);

    _createClass(PostMessageRpcServer, [{
        key: 'mount',
        value: function mount(window) {
            window.addEventListener('message', this.handleMessage);
        }
    }, {
        key: 'unmount',
        value: function unmount(window) {
            window.removeEventListener('message', this.handleMessage);
        }
    }]);

    return PostMessageRpcServer;
})(_pmRouterJs2['default']);

exports['default'] = PostMessageRpcServer;
module.exports = exports['default'];
