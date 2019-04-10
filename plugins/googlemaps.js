import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
//import GmapCluster from 'vue2-google-maps/dist/components/cluster';

Vue.use(VueGoogleMaps, {
	load: {
		key: 'AIzaSyBF9_cnkkul1wOVNGqYwdeRxHy8LEfwajE',
		libraries: 'places',
	},
});

//Vue.component('GmapCluster', GmapCluster)
