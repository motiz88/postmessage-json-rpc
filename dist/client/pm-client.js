'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _uniqueid = require('uniqueid');

var _uniqueid2 = _interopRequireDefault(_uniqueid);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function isWindow(maybeWindow) {

    return maybeWindow && maybeWindow.window === maybeWindow;
}

/**
 * A JSON-RPC 2.0 client that sends requests and notifications over `window.postMessage`.
 * @constructor
 */

var PostMessageRpcClient = (function () {
    function PostMessageRpcClient(targetWindow) {
        var _this = this;

        _classCallCheck(this, PostMessageRpcClient);

        this._instanceId = 'PostMessageRpcClient' + (0, _shortid2['default'])();
        this._dispatches = new _Map();

        this.handleMessage = function (e) {
            if (!e.data || typeof e.data.id === 'undefined' || !e.data.jsonrpc || 'method' in e.data) return;
            var dispatch = _this._dispatches.get(e.data.id);
            _this._dispatches['delete'](e.data.id);
            if (dispatch && dispatch.resolve && dispatch.reject) {
                if (e.data.error) dispatch.reject(e.data.error);else dispatch.resolve(e.data.result);
            }
        };

        this.targetWindow = targetWindow;
    }

    _createClass(PostMessageRpcClient, [{
        key: 'mount',

        /** @function mount
          * @memberof PostMessageRpcClient.prototype */
        value: function mount(window) {
            window.addEventListener('message', this.handleMessage);
        }
    }, {
        key: 'unmount',

        /** @function unmount
          * @memberof PostMessageRpcClient.prototype
          */
        value: function unmount(window) {
            window.removeEventListener('message', this.handleMessage);
        }
    }, {
        key: '_dispatch',

        /** @function _dispatch
          * @memberof PostMessageRpcClient.prototype
          * @access private
          */
        value: function _dispatch(method, id) {
            for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                params[_key - 2] = arguments[_key];
            }

            var _this2 = this;

            var target = this.targetWindow;
            if (params.length && isWindow(params[0])) target = params.shift();
            if (!isWindow(target)) {
                throw new Error('Target window not set');
            }
            return new _Promise(function (resolve, reject) {
                if (typeof id !== 'undefined') _this2._dispatches.set(id, {
                    resolve: resolve, reject: reject
                });
                try {
                    var message = {
                        jsonrpc: '2.0',
                        id: id,
                        method: method,
                        params: params
                    };
                    var origin = target.location.origin;
                    if (origin === 'null' || origin === 'about://' /* holy crap, IE! */) origin = null;
                    target.postMessage(message, origin || '*');
                    if (typeof id === 'undefined') resolve();
                } catch (e) {
                    _this2._dispatches['delete'](id);
                    reject(e);
                }
            });
        }
    }, {
        key: 'notify',

        /** @function notify
          * @memberof PostMessageRpcClient.prototype
          */
        value: function notify(method) {
            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            return this._dispatch.apply(this, [method, undefined].concat(params));
        }
    }, {
        key: 'request',

        /** @function request
          * @memberof PostMessageRpcClient.prototype
          */
        value: function request(method) {
            for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                params[_key3 - 1] = arguments[_key3];
            }

            return this._dispatch.apply(this, [method, (0, _uniqueid2['default'])(this._instanceId + '_')].concat(params));
        }
    }]);

    return PostMessageRpcClient;
})();

exports['default'] = PostMessageRpcClient;
module.exports = exports['default'];
