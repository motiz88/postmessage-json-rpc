export default class PostMessageRouter {
    constructor(handlers, defaultHandler) {
        this.handlers = handlers;
        if (!this.handlers || typeof this.handlers !== 'object')
            this.handlers = {};
        this.defaultHandler = defaultHandler || (e => {
            throw new Error(`No handler found for method '${e.data.method}'`);
        });
    }

    handleMessage = (e) => {
        if (!e.data || !e.data.method || !e.data.jsonrpc || e.data.error || 'result' in e)
            return undefined;
        const func = this.handlers[e.data.method];
        if (typeof func !== 'function')
            return this.defaultHandler(e);

        const invokeHandler = () => {
            const result = func.call(this.handlers, ...(e.data.params || []));
            return result;
        };

        if (typeof e.data.id === 'undefined') {
            invokeHandler();
            return undefined;
        }
        return new Promise(resolve => {
            resolve(invokeHandler());
        });
    }
}