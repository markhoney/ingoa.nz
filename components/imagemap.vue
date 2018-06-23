<template>
	<section>
		<img :src="imagemap.image.map" :alt="imagemap.name" :id="imagemap.code" :usemap="'#map-' + imagemap.code" />
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
export default {
	props: {
		imagemap: Object,
		hash: {
			type: Boolean,
			default: false
		}
	},
}
</script>
