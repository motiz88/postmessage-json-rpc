/* eslint-env browser */

import PostMessageRespondingRouter from './pm-responding-router.js';

/** A JSON-RPC 2.0 server that handles requests and notifications over `window.postMessage`. */
export default class Server extends PostMessageRespondingRouter {
	/** Constructs a Server instance.
	  * @param {object} handlers - The object whose methods will be exposed over JSON-RPC.
	  *							   Each method may return either a Promise, a plain value, or nothing at all.
	  * @param {MessageEventHandler=} defaultHandler - This callback is invoked when a `message` event cannot be
	  * 											   routed to a handler. If this is omitted, unroutable messages
	  *												   will cause exceptions to be thrown.
	  */
    constructor(handlers, defaultHandler) {
        super(handlers, defaultHandler);
    }

	/** Start listening for `message` events.
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
}

/**
 * @callback MessageEventHandler
 * @param {MessageEvent} event
 */