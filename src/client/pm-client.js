import uniqueid from 'uniqueid';
import shortid from 'shortid';

function isWindow(maybeWindow) {

    return maybeWindow && maybeWindow.window === maybeWindow;
}

export
default class PostMessageRpcClient {
    constructor(targetWindow) {
        this.targetWindow = targetWindow;
    }

    _instanceId = 'PostMessageRpcClient' + shortid();
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

    mount(window) {
        window.addEventListener('message', this.handleMessage);
    }

    unmount(window) {
        window.removeEventListener('message', this.handleMessage);
    }

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

    notify(method, ...params) {
        return this._dispatch(method, undefined, ...params);
    }

    request(method, ...params) {
        return this._dispatch(method, uniqueid(this._instanceId + '_'), ...params);
    }
}