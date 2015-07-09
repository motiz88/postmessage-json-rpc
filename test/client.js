import {
    Client
}
from '../src';

import {loadScript} from './utils';

const scripts = {
    echo: `
		window.addEventListener('message', function(e) {
			if (e.source !== window)
				e.source.postMessage({jsonrpc: '2.0', result: e.data.params, id: e.data.id}, e.origin);
		});
	`,
    error: `
		window.addEventListener('message', function(e) {
			if (e.source !== window)
				e.source.postMessage({jsonrpc: '2.0', error: {code: 0, message: 'hey'}, id: e.data.id}, e.origin);
		});
	`,
};

const fakeTarget = {
    postMessage() {
        throw new Error();
    },
    location: {
        origin: 'http://example.com/'
    },
};
fakeTarget.window = fakeTarget;

describe('postMessage RPC client', function() {
    let client, server;
    before(function() {
        client = new Client();
        client.mount(window);
    });
    beforeEach(function() {
        server = document.createElement('iframe');
        document.body.appendChild(server);
    });
    it('throws on request missing target', function() {
        (() => {
            client.request('OneTwoThree', 1, 2, 3);
        }).should.throw(Error);
    });
    it('simple notification without checking result', function() {
        loadScript(server, scripts.echo);
        return client.notify('OneTwoThree', server.contentWindow, 1, 2, 3).should.be.fulfilled;
    });
    it('simple round-trip request', function() {
        loadScript(server, scripts.echo);
        return client.request('OneTwoThree', server.contentWindow, 1, 2, 3).should.eventually.deep.equal([1, 2, 3]);
    });
    it('silently ignores a response with a non-matching id', function() {
        client.handleMessage({
            data: {
                id: 'bla'
            }
        });
    });
    it('silently ignores a response with no id field', function() {
        client.handleMessage({
            data: {jsonrpc: '2.0', result: {}},
        });
    });
    it('silently ignores a valid response with an unfamiliar id', function() {
        client.handleMessage({
            data: {jsonrpc: '2.0', id: 'blablablablablabla', result: {}},
        });
    });
    it('round-trip request with error', function() {
        loadScript(server, scripts.error);
        return client.request('OneTwoThree', server.contentWindow, 1, 2, 3).should.be.rejected;
    });
    it('request with a malfunctioning target object', function() {
        loadScript(server, scripts.echo);
		return client.request('OneTwoThree', fakeTarget, 1, 2, 3).should.be.rejected;
    });
    afterEach(function() {
        server.parentNode.removeChild(server);
    });
    after(function() {
        client.unmount(window);
    });
});
