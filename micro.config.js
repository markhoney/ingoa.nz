const dispatch = require('micro-route/dispatch')
//const cache = require('micro-cacheable')
const {send} = require('micro')
const api = require('./api/')
const nuxt = require('./nuxt.index.js')

module.exports = dispatch()
	.dispatch('/api/islands', ['GET'], async (req, res) => send(res, 200, await api.getIslands()))
	.dispatch('/api/islands/regions', ['GET'], async (req, res) => send(res, 200, await api.getIslands({}, 1)))
	.dispatch('/api/islands/regions/zones', ['GET'], async (req, res) => send(res, 200, await api.getIslands({}, 2)))
	.dispatch('/api/islands/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getIsland({code: params.code})))
	.dispatch('/api/islands/:code/regions', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getIsland({code: params.code}, 1)))
	.dispatch('/api/islands/:code/regions/zones', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getIsland({code: params.code}, 2)))
	.dispatch('/api/parts', ['GET'], async (req, res) => send(res, 200, await api.getParts()))
	.dispatch('/api/parts/regions', ['GET'], async (req, res) => send(res, 200, await api.getParts({}, 1)))
	.dispatch('/api/parts/regions/zones', ['GET'], async (req, res) => send(res, 200, await api.getParts({}, 2)))
  .dispatch('/api/parts/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getPart({code: params.code})))
  .dispatch('/api/parts/:code/regions', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getPart({code: params.code}, 1)))
  .dispatch('/api/parts/:code/regions/zones', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getPart({code: params.code}, 2)))
	.dispatch('/api/imagemaps', ['GET'], async (req, res) => send(res, 200, await api.getImageMaps()))
	.dispatch('/api/imagemaps/regions', ['GET'], async (req, res) => send(res, 200, await api.getImageMaps({}, 1)))
	.dispatch('/api/imagemaps/regions/zones', ['GET'], async (req, res) => send(res, 200, await api.getImageMaps({}, 2)))
  .dispatch('/api/imagemaps/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getImageMap({code: params.code})))
  .dispatch('/api/imagemaps/:code/regions', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getImageMap({code: params.code}, 1)))
  .dispatch('/api/imagemaps/:code/regions/zones', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getImageMap({code: params.code}, 2)))
	.dispatch('/api/regions', ['GET'], async (req, res) => send(res, 200, await api.getRegions()))
	.dispatch('/api/regions/zones', ['GET'], async (req, res) => send(res, 200, await api.getRegions({}, 1)))
  .dispatch('/api/regions/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getRegion({code: params.code})))
  .dispatch('/api/regions/:code/zones', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getRegion({code: params.code}, 1)))
	.dispatch('/api/zones', ['GET'], async (req, res) => send(res, 200, await api.getZones()))
  .dispatch('/api/zones/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getZone({code: params.code})))
	.dispatch('/api/speakers', ['GET'], async (req, res) => send(res, 200, await api.getSpeakers()))
  .dispatch('/api/speakers/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getSpeaker({code: params.code})))
	.dispatch('/api/kinds', ['GET'], async (req, res) => send(res, 200, await api.getKinds()))
	.dispatch('/api/kinds/:code', ['GET'], async (req, res, {params, query}) => send(res, 200, await api.getKind({code: params.code})))
	.dispatch('/api/suggestions', ['GET'], async (req, res) => send(res, 200, await api.getSuggestions()))
  .dispatch('*', ['GET'], (req, res) => nuxt.render(req, res))

/* Test URLs

	http://localhost:3000/api/islands
	http://localhost:3000/api/islands/regions
	http://localhost:3000/api/islands/regions/zones
	http://localhost:3000/api/islands/north_island
	http://localhost:3000/api/islands/north_island/regions
	http://localhost:3000/api/islands/north_island/regions/zones
	http://localhost:3000/api/parts
	http://localhost:3000/api/parts/regions
	http://localhost:3000/api/parts/regions/zones
  http://localhost:3000/api/parts/lower_north_island
  http://localhost:3000/api/parts/lower_north_island/regions
  http://localhost:3000/api/parts/lower_north_island/regions/zones
	http://localhost:3000/api/imagemaps
	http://localhost:3000/api/imagemaps/regions
	http://localhost:3000/api/imagemaps/regions/zones
  http://localhost:3000/api/imagemaps/lower_north_island
  http://localhost:3000/api/imagemaps/lower_north_island/regions
  http://localhost:3000/api/imagemaps/lower_north_island/regions/zones
	http://localhost:3000/api/regions
	http://localhost:3000/api/regions/zones
  http://localhost:3000/api/regions/wellington
  http://localhost:3000/api/regions/wellington/zones
	http://localhost:3000/api/zones
  http://localhost:3000/api/zones/wellington
	http://localhost:3000/api/speakers
  http://localhost:3000/api/speakers/maurice_gray
	http://localhost:3000/api/kinds
	http://localhost:3000/api/kinds/marae
	http://localhost:3000/api/suggestions

*/
