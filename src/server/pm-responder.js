function toResponse(promise, id) {
    return promise.then(result => ({
        jsonrpc: '2.0',
        result,
        id,
    }), error => ({
        jsonrpc: '2.0',
        error: Object.assign({}, error),
        id,
    }));
}

export default class PostMessageResponder {
    constructor(router) {
        this.router = router;
    }

    handleMessage = (e) => {
        const result = this.router.handleMessage(e);
        if (!result)
            return;
        toResponse(result, e.data.id)
            .then(response => {
                e.source.postMessage(response, e.origin);
            });
    }
}
