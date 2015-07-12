import uniqueid from 'uniqueid';
import shortid from 'shortid';

/** @ignore */
function isWindow(maybeWindow) {
    return maybeWindow && maybeWindow.window === maybeWindow;
}

/**
 * A JSON-RPC 2.0 client that sends requests and notifications over `window.postMessage`.
 */
export
default class Client {
    /** Construct a Client instance.
     * @param {Window=} targetWindow - The default server window.
     */
    constructor(targetWindow) {
        this.targetWindow = targetWindow;
    }

    _instanceId = 'postmessage-json-rpc.Client' + shortid();
    _dispatches = new Map();

    handleMessage = (e) => {
        if (!e.data || typeof e.data.id === 'undefined' || !e.data.jsonrpc || 'method' in e.data)
            return;
        const dispatch = this._dispatches.get(e.data.id);
        this._dispatches.delete(e.data.id);
        if (dispatch && dispatch.resolve && dispatch.reject) {
            if (e.data.error)
                dispatch.reject(e.data.error);
            else
                dispatch.resolve(e.data.result);
        }
    }

    /** Start listening for `message` events (to receive results of requests).
     * @param {Window} window - The browser window to which a handler will be attached.
     */
    mount(window) {
        window.addEventListener('message', this.handleMessage);
    }

    /** Stop listening for `message` events.
     * @param {Window} window - The browser window from which the handler will be detached.
     */
    unmount(window) {
        window.removeEventListener('message', this.handleMessage);
    }

    /** @access private */
    _dispatch(method, id, ...params) {
        let target = this.targetWindow;
        if (params.length && isWindow(params[0]))
            target = params.shift();
        if (!isWindow(target)) {
            throw new Error('Target window not set');
        }
        return new Promise((resolve, reject) => {
            if (typeof id !== 'undefined')
                this._dispatches.set(id, {
                    resolve, reject
                });
            try {
                const message = {
                    jsonrpc: '2.0',
                    id,
                    method,
                    params
                };
                let origin = target.location.origin;
                if (origin === 'null' || origin === 'about://' /* holy crap, IE! */)
                    origin = null;
                target.postMessage(message, origin || '*');
                if (typeof id === 'undefined')
                    resolve();
            } catch (e) {
                this._dispatches.delete(id);
                reject(e);
            }
        });
    }

    /** Invoke a named RPC method on the server window, ignoring the result.
      * @param {string} method
      * @param {Window=} targetWindow - The server window to use for this invocation. Not required if this was set in the constructor.
      * @returns {Promise} - A promise that resolves as soon as the message is posted.
      */
    notify(method, ...params) {
        return this._dispatch(method, undefined, ...params);
    }

    /** Invoke a named RPC method on the server window, ignoring the result.
      * @param {string} method
      * @param {Window=} targetWindow - The server window to use for this invocation. Not required if this was set in the constructor.
      * @returns {Promise} - A promise that either resolves to the return value of the method, or is rejected with an error object (if the method throws).
      */
    request(method, ...params) {
        return this._dispatch(method, uniqueid(this._instanceId + '_'), ...params);
    }
}
