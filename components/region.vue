<template>
	<v-card>
		<nuxt-link :to="localePath({name: 'regions-region', params: {region: region.code}})"><v-card-media :src="region.image.landscape" height="180px"></v-card-media></nuxt-link>
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'regions-region', params: {region: region.code}})">{{localeName(region.name)}}</nuxt-link></h3>
				<h3>{{localeAltName(region.name, '&nbsp;')}}</h3>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
export default {
	props: {
		region: Object
	},
}
</script>
