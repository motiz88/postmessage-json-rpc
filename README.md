## postmessage-json-rpc [![Build Status](https://travis-ci.org/motiz88/postmessage-json-rpc.svg?branch=master)](https://travis-ci.org/motiz88/postmessage-json-rpc) [![Coverage Status](https://coveralls.io/repos/motiz88/postmessage-json-rpc/badge.svg?branch=master&service=github)](https://coveralls.io/github/motiz88/postmessage-json-rpc?branch=master)

JSON-RPC over `window.postMessage`, with a Promise-based API.

This package provides a server and client written in JavaScript that can communicate with each other across browser windows or `iframe`s.


## Code Example

### ES2015
```javascript
import {Client, Server} from 'postmessage-json-rpc';
const client = new Client();
const server = new Server({
	hello(who) {
		return Promise.resolve(`Hello ${who}!`);
	}
});

client.mount(window);
server.mount(window);

client.request('hello', window, 'world, of course')
	.then(answer => console.log(answer));

// Hello world, of course!

```

### ES5
```javascript
var rpc = require('postmessage-json-rpc');
var client = new rpc.Client();
var server = new rpc.Server({
	hello: function(who) {
		return Promise.resolve('Hello ' + who + '!');
	}
});

client.mount(window);
server.mount(window);

client.request('hello', window, 'world, of course').then(function (answer) {
	return console.log(answer);
});

// Hello world, of course!
```

## Motivation

I had a need to quickly "componentize" a legacy web app from an older project, so I could run it in an `iframe` in a new project and invoke bits of its internal API. I implemented a basic RPC server (for the legacy app) and client (for the host app) using `window.postMessage`/`window.onmessage` as the communication channel and (at the moment, loosely) JSON-RPC 2.0 as the message format, and that became the basis of `postmessage-json-rpc`.

There were already some libraries that did something like this, but I really wanted a fully Promise-based async API on both the client and server side. So I coded one myself :smile:

## Installation

```sh
npm install --save postmessage-json-rpc
```

Use Browserify / Webpack to include this module in your front-end code.

## API Reference

(Watch this space for updates.)

## Tests

Clone this repo, and then run:

```sh
npm install
karma start --single-run
```

## Contributors

I welcome and greatly appreciate bug reports, feature ideas, and pull requests in all areas.

## License

MIT
