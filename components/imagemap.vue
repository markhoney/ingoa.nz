<template>
	<section>
		<img :src="imagemap.image.map" :alt="imagemap.name" :usemap="'#' + imagemap.code" />
		<map :name="imagemap.code">
			<section v-for="zone in imagemap.zones" :key="zone">
				<area v-for="area in zone.location.imagemap.areas" :key="area" :shape="area.shape" :coords="area.coords" :href="'/zone/' + zone.code" :alt="zone.name" :title="zone.name"/>
			</section>
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
