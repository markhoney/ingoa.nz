const consola = require('consola');
const {Nuxt, Builder} = require('nuxt');
const http = require('http');

// Import and Set Nuxt.js options
let config = require('../../nuxt.config.js');
config.dev = process.env.dev;

async function start() {
	// Init Nuxt.js
	const nuxt = new Nuxt(config);

	const {host, port} = nuxt.options.server;

	// Build only in dev mode
	if (config.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	} else {
		await nuxt.ready();
	}

	// Listen the server
	http.createServer(nuxt.render).listen(port);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	});
}
start();
