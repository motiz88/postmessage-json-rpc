import PostMessageResponder from './pm-responder';
import PostMessageRouter from './pm-router';

export default class PostMessageRespondingRouter {
    constructor(...args) {
        this._router = new PostMessageRouter(...args);
        this._responder = new PostMessageResponder(this._router);
        this.handleMessage = this._responder.handleMessage;
    }
}
