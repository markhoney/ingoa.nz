<template>
	<section v-if="map">
		<h2 :id="map.code" class="display-1 mb-0 text-sm-center">
			{{map.name.locale.en}}
		</h2>
		<h3 class="headline mb-0 text-sm-center mb-3">{{map.name.locale.mi}}</h3>
		<img :src="require(`~/assets${map.images.portrait}`)" :alt="map.name.locale.en" field="id" :value="map.id" :usemap="'#map-' + map.code">
		<map :name="'map-' + map.code">
			<template v-for="sector in map.sectors">
				<template v-for="zone in sector.zones">
					<g-link v-for="(area, index) in zone.maplink.mapareas" :to="'/old/' + zone.id" :key="zone.id + index"
						:shape="area.shape" :coords="area.coords.map(coord => parseInt(coord)).join(',')" :title="localeBoth(zone.name.locale)" tag="area" />
					<!--:alt="localeBoth(zone.name.locale)" -->
				</template>
			</template>
			<template v-for="link in map.maplinks">
				<g-link v-for="(area, index) in link.mapareas"
					:to="localePath(hash ? {name: 'island-island', params: {island: localeCurrent(map.island.slug)}, hash: '#' + localeCurrent(link.map.slug)} : {name: 'island-island', params: {island: localeCurrent(map.island.slug)}})"
					:key="[link.map.id, index].join('-')" :shape="area.shape" :coords="area.coords.map(coord => parseInt(coord)).join(',')" :title="localeBoth(link.map.name.locale)" tag="area" />
			</template>
		</map>
		<p class="text-sm-center">{{$t('imagemap')}}</p>
	</section>
</template>

<script>
	export default {
		props: {
			map: Object,
			field: String,
			value: String,
			hash: {
				type: Boolean,
				default: false,
			},
		},
		head: {
			script: [{src: 'https://unpkg.com/image-map/dist/image-map.js'}],
		},
		mounted() {
			this.$nextTick(() => {
				if (process.client) {
					window.onNuxtReady(app => {
						ImageMap('img[usemap]');
					});
				}
			});
		},
	};
</script>

<style scoped>
	img {
		display: block;
		max-width: 100%;
		margin: 0 auto;
	}
</style>
