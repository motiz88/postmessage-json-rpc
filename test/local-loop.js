import {Client, Server} from '../src';
import {resetAll, spyAll} from './utils';

describe('postMessage RPC in one window', function() {
    let client, server, handlers;
    before(function() {
        client = new Client();
        client.mount(window);
        handlers = spyAll({
            echo(...args) { return args; },
            error() { throw new Error(); },
        });
        server = new Server(handlers);
        server.mount(window);
    });
    beforeEach(function() {
        resetAll(handlers);
    });
    it('simple notification', function() {
        return client.notify('echo', window, 1, 2, 3).should.be.fulfilled
            .then(() => {
                handlers.echo.should.have.been.calledOnce.and.calledWith(1, 2, 3);
            });
    });
    it('simple round-trip request', function() {
        return client.request('echo', window, 4, 5, 6).should.eventually.deep.equal([4, 5, 6])
            .then(() => {
                handlers.echo.should.have.been.calledOnce.and.calledWith(4, 5, 6);
            });
    });
    it('round-trip request with error', function() {
        return client.request('error', window, 1, 2, 9).should.be.rejected
            .then(() => {
                handlers.error.should.have.been.calledOnce.and.calledWith(1, 2, 9);
            });
    });
    after(function() {
        client.unmount(window);
        server.unmount(window);
    });
});