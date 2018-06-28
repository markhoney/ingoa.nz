<template>
	<v-card>
		<nuxt-link :to="localePath({name: 'regions-region', params: {region: region.code}})"><v-card-media :src="region.image.landscape" height="160px"></v-card-media></nuxt-link>
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'regions-region', params: {region: region.code}})">{{localeName(region.names)}}</nuxt-link></h3>
				<h3 class="mb-1">{{localeAltName(region.names, '&nbsp;')}}</h3>
				<div><p><nuxt-link v-for="(zone, index) in region.zones" :key="zone.code" :to="localePath({name: 'zones-zone', params: {zone: zone.code}})">{{localeName(zone.names)}}<template v-if="index != (region.zones.length - 1)">, </template></nuxt-link></p></div>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
export default {
	props: {
		region: Object
	}
}
</script>
