<template>
	<v-card>
		<nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})"><v-card-media :src="zone.image.landscape" height="160px"></v-card-media></nuxt-link><!--  height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})">{{localeName(zone.names)}}</nuxt-link></h3>
				<h3>{{localeAltName(zone.names)}}</h3>
				<div><p v-html="zone.description"></p></div>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
export default {
	props: {
		zone: Object
	}
}
</script>
