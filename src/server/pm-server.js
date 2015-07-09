/* eslint-env browser */

import PostMessageRespondingRouter from './pm-responding-router.js';

export default class PostMessageRpcServer extends PostMessageRespondingRouter {
    constructor(...args) {
        super(...args);
    }

    mount(window) {
        window.addEventListener('message', this.handleMessage);
    }

    unmount(window) {
        window.removeEventListener('message', this.handleMessage);
    }
}