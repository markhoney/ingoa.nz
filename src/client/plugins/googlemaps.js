import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import GmapCluster from 'vue2-google-maps/dist/components/cluster';
Vue.component('GmapCluster', GmapCluster);

Vue.use(VueGoogleMaps, {load: {
	key: process.env.googleMapsAPI,
	libraries: 'places',
}});
