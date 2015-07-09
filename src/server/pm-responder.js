import util from 'util';

export default class PostMessageResponder {
    constructor(router) {
        this.router = router;
    }

    handleMessage = (e) => {
        const resultPromise = this.router.handleMessage(e);
        if (!resultPromise)
            return;

        resultPromise
            .then(result => ({result}),
                error => ({
                    error: {
                        code: -32000,
                        message: error.message || error.code || error.name,
                        data: util.inspect(error)
                    }
                }))
            .then(response => Object.assign({
                jsonrpc: '2.0',
                id: e.data.id
            }, response))
            .then(response => e.source.postMessage(response, '*'));
    }
}