export default class PostMessageRouter {
    constructor(handlers) {
        this.handlers = handlers;
        if (!this.handlers || typeof this.handlers !== 'object')
            this.handlers = {};
    }

    handleMessage = (e) => {
        if (!e.data || !e.data.method) {
            // ignore obviously invalid messages: they're not for us
            return undefined;
        }
        const func = this.handlers[e.data.method];
        if (typeof func !== 'function')
            throw new Error(`No handler found for method '${e.data.method}'`);
        try {
            const retval = func.call(this.handlers, ...(e.data.params || []));
            if (typeof e.data.id === 'undefined')
                return undefined;
            if (typeof retval === 'object' && retval && typeof retval.then === 'function') // it's a promise!
                return retval;
            return Promise.resolve(retval);
        } catch (er) {
            return Promise.reject(er);
        }
    }
}