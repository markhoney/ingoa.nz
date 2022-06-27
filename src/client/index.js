// if (process.env.NODE_ENV !== 'production') require('appmetrics-dash').attach();
const consola = require('consola');
const {Nuxt, Builder} = require('nuxt');
//const http = require('http');

// Import and Set Nuxt.js options
const config = require('../../nuxt.config.js');
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
	//http.createServer(nuxt.render).listen(port);
	nuxt.listen(port, host);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true,
	});
}
start();
