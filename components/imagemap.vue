<template>
	<section>
		<img :src="imagemap.image.trans" :alt="imagemap.name" :id="imagemap.code" :usemap="'#map-' + imagemap.code" />
		<map :name="'map-' + imagemap.code">
			<template v-for="zone in imagemap.zones">
				<template v-for="(area, index) in zone.location.imagemap.areas">
					<nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})" :key="zone.code + index">
						<area :shape="area.shape" :coords="area.coords" :title="localeNames(zone.names)"/><!--:alt="localeNames(zone.names)" -->
					</nuxt-link>
				</template>
			</template>
			<template v-for="link in imagemap.imagemaplinks">
				<nuxt-link :to="localePath(hash ? {path: '#' + link.linkedmap.code} : {name: 'islands-island', params: {island: link.linkedmap.code}})" v-for="(area, index) in link.areas" :key="link.map + '-' + link.linkedmap.id + '-' + index">
					<area :shape="area.shape" :coords="area.coords" :title="localeNames(link.linkedmap.names)"/>
				</nuxt-link>
			</template>
		</map>
	</section>
</template>

<script>
/*if (process.browser) {
	require('image-map');
}*/
export default {
	props: {
		imagemap: Object,
		hash: {
			type: Boolean,
			default: false
		}
	},
	head: {
    script: [
			{src: 'https://unpkg.com/image-map/image-map.min.js'}
		],
	},
	mounted () {
		this.$nextTick(() => {
			if (process.browser) {
				window.onNuxtReady((app) => {
						ImageMap('img[usemap]');
				})
			}
		});
	}
}
</script>

<style scoped>
img {
	max-width: 100%;
}
</style>
