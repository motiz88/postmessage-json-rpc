import PostMessageResponder from './pm-responder';
import PostMessageRouter from './pm-router';

export default
/** @ignore */
class PostMessageRespondingRouter {
    constructor(handlers, defaultHandler) {
        this._router = new PostMessageRouter(handlers, defaultHandler);
        this._responder = new PostMessageResponder(this._router);
        this.handleMessage = this._responder.handleMessage;
    }
}