import PostMessageResponder from './pm-responder';
import PostMessageRouter from './pm-router';

export default class PostMessageRespondingRouter extends PostMessageRouter {
    constructor(...args) {
        super(...args);
        this._responder = new PostMessageResponder(this);
    }

    handleMessage = this._responder.handleMessage;
}
