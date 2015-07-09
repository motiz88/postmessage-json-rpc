import {Server} from '../src';
import {resetAll, valuesOf, spyAll, loadScript, loadScriptAndDefer} from './utils';

const sharedScript = `
    function to(target, method, params, id) {
        var message = {
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: id
        };
        target.postMessage(message, '*');
    }

    function p(method, params, id) {
        return to(window.parent, method, params, id);
    }
    window.addEventListener('message', function(e) {
        if (e.source !== window && e.data && e.data.jsonrpc) {
            if (e.data.error)
                to(e.source, 'echoError', [e.data.error]);
            else
                to(e.source, 'echoResult', [e.data.result]);
        }
    });
`;

const fakeSource = {
    postMessage() {
        throw new Error();
    },
    location: {
        origin: 'http://example.com/'
    },
};
fakeSource.window = fakeSource;

describe('postMessage RPC server', function() {
    let server, client, handlers, defaultHandler;

    beforeEach(function() {
        resetAll(handlers);
        defaultHandler.reset();
        client = document.createElement('iframe');
        document.body.appendChild(client);
        loadScript(client, sharedScript);
    });
    afterEach(function() {
        client.parentNode.removeChild(client);
    });

    describe('with some handlers', function() {
        before(function() {
            handlers = spyAll({
                noop() {},
                return100() { return 100; },
                return500promise() { return Promise.resolve(500); },
                error() { throw new Error(); },
                echoError() {},
                echoResult() {},
            });

            defaultHandler = sinon.spy();

            server = new Server(handlers, defaultHandler);
            server.mount(window);
        });

        it('receives & routes a notification', function() {
            return loadScriptAndDefer(client, `p('noop', ['hey', 'there']);`, () => {
                const {noop, ...rest} = handlers;
                noop.should.have.been.calledOnce.and.calledWith('hey', 'there');
                valuesOf(rest).forEach(handler => handler.should.not.have.been.called);
                defaultHandler.should.not.have.been.called;
            });
        });
        it('receives & routes a request to a method with no return value, sends Response to client', function() {
            return loadScriptAndDefer(client, `p('noop', [], '1234');`, () => {
                const {noop, echoResult, ...rest} = handlers;
                noop.should.have.been.calledOnce.and.calledWith();
                echoResult.should.have.been.calledOnce.and.calledWith();
                valuesOf(rest).forEach(handler => handler.should.not.have.been.called);
                defaultHandler.should.not.have.been.called;
            });
        });
        it('receives & routes a request that is missing params', function() {
            return loadScriptAndDefer(client, `p('noop', undefined, '1234');`, () => {
                const {noop, echoResult, ...rest} = handlers;
                noop.should.have.been.calledOnce.and.calledWith();
                echoResult.should.have.been.calledOnce.and.calledWith();
                valuesOf(rest).forEach(handler => handler.should.not.have.been.called);
                defaultHandler.should.not.have.been.called;
            });
        });
        it('receives & routes a request to a value-returning method, sends Response to client', function() {
            return loadScriptAndDefer(client, `p('return100', [123], '1234');`, () => {
                const {return100, echoResult, ...rest} = handlers;
                return100.should.have.been.calledOnce.and.calledWith(123);
                echoResult.should.have.been.calledOnce.and.calledWith(100);
                valuesOf(rest).forEach(handler => handler.should.not.have.been.called);
                defaultHandler.should.not.have.been.called;
            });
        });
        it('receives & routes a request to a Promise-returning method, sends Response to client', function() {
            return loadScriptAndDefer(client, `p('return500promise', [{a: 123}], '1234');`, () => {
                const {return500promise, echoResult, ...rest} = handlers;
                return500promise.should.have.been.calledOnce.and.calledWith({a: 123});
                echoResult.should.have.been.calledOnce.and.calledWith(500);
                valuesOf(rest).forEach(handler => handler.should.not.have.been.called);
                defaultHandler.should.not.have.been.called;
            });
        });
        it('receives & routes a request to an erroring method, sends Error to client', function() {
            return loadScriptAndDefer(client, `p('error', [['an array']], '1234');`, () => {
                const {error, echoError, ...rest} = handlers;
                error.should.have.been.calledOnce.and.calledWith(['an array']);
                echoError.should.have.been.calledOnce;
                valuesOf(rest).forEach(handler => handler.should.not.have.been.called);
                defaultHandler.should.not.have.been.called;
            }, 500);
        });
        it('invokes the supplied default handler on an unroutable message event', function() {
            loadScriptAndDefer(client, `p('nonesuch', ['hey', 'there']);`, () => {
                valuesOf(handlers).forEach(handler => handler.should.not.have.been.called);
                defaultHandler.should.have.been.calledOnce;
            });
        });
        after(function() {
            server.unmount(window);
        });
    });
    describe('default-constructed', function() {
        before(function() {
            server = new Server();
            server.mount(window);
        });
        it('throws by default on an unroutable message event', function(done) {
            const prevErrorHandler = window.onerror;
            window.onerror = function(errorMsg, url, lineNumber) {
                done();
                window.onerror = prevErrorHandler;

                if (prevErrorHandler)
                    return prevErrorHandler(errorMsg, url, lineNumber);

                return true;
            };

            loadScript(client, `p('nonesuch', ['hey', 'there']);`);
        });
        after(function() {
            server.unmount(window);
        });
    });
});