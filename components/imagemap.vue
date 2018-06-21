<template>
	<section>
		<img :src="imagemap.image.map" :alt="imagemap.name" :usemap="'#' + imagemap.code" />
		<map :name="imagemap.code">
			<template v-for="zone in imagemap.zones">
				<nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})" v-for="area in zone.location.imagemap.areas" :key="area.coords">
					<area :shape="area.shape" :coords="area.coords" :alt="localeNames(zone.name)" :title="localeNames(zone.name)"/>
				</nuxt-link>
			</template>
			<template v-for="link in imagemap.imagemaplinks">
				<nuxt-link :to="localePath({name: 'islands-island', params: {island: imagemap.island.code}})"  v-for="area in link.areas" :key="area.coords">
					<area :shape="area.coords" :coords="area.coords" :title="localeNames(link.name)"/>
				</nuxt-link>
			</template>
		</map>
	</section>
</template>

<script>
export default {
	props: {
		imagemap: Object
	},
}
</script>
