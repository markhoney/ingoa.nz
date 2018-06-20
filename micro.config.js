const dispatch = require('micro-route/dispatch')
//const cache = require('micro-cacheable')
const {send} = require('micro')
const api = require('./api/')
const nuxt = require('./nuxt.index.js')

module.exports = dispatch()
	.dispatch('/api/parts', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getParts({}, query.depth))))
	.dispatch('/api/parts/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getParts({code: params.code}, query.depth))[0]))
	.dispatch('/api/islands', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getIslands({}, query.depth))))
	.dispatch('/api/islands/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getIslands({code: params.code}, query.depth))[0]))
	.dispatch('/api/imagemaps', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getImageMaps({}, query.depth))))
	.dispatch('/api/imagemaps/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getImageMaps({code: params.code}, query.depth))[0]))
	.dispatch('/api/regions', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getRegions({}, query.depth))))
	.dispatch('/api/regions/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getRegions({code: params.code}, query.depth))[0]))
	.dispatch('/api/zones', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getZones({}, query.depth))))
	.dispatch('/api/zones/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getZones({code: params.code}, query.depth))[0]))
	.dispatch('/api/speakers', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getSpeakers({}, query.depth))))
	.dispatch('/api/speakers/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getSpeakers({code: params.code}, query.depth))[0]))
	.dispatch('/api/kinds', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getKinds({}, query.depth))))
	.dispatch('/api/kinds/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getKinds({code: params.code}, query.depth))[0]))
	.dispatch('/api/suggestions', ['GET'], async (req, res, {params, query}) => send(res, 200, (await api.getSuggestions())))
	.dispatch('*', ['GET'], (req, res) => nuxt.render(req, res))


/* Test URLs
	Where the depth query parameter denotes how many levels deep you want the returned data to be. Paths are:

	islands/imagemaps/regions/zones/places
	parts/regions/zones/places

	http://localhost:3000/api/islands?depth=0
	http://localhost:3000/api/islands/north_island
	http://localhost:3000/api/parts
  http://localhost:3000/api/parts/lower_north_island
	http://localhost:3000/api/imagemaps
  http://localhost:3000/api/imagemaps/lower_north_island
	http://localhost:3000/api/regions
  http://localhost:3000/api/regions/wellington
	http://localhost:3000/api/zones
  http://localhost:3000/api/zones/wellington
	http://localhost:3000/api/speakers
  http://localhost:3000/api/speakers/maurice_gray
	http://localhost:3000/api/kinds
	http://localhost:3000/api/kinds/marae
	http://localhost:3000/api/suggestions

*/
