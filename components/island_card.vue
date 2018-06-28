<template>
	<v-card>
		<nuxt-link :to="localePath({name: 'islands-island', params: {island: island.code}})"><v-card-media :src="island.image.landscape" height="160px"></v-card-media></nuxt-link><!--  height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'islands-island', params: {island: island.code}})">{{localeName(island.names)}}</nuxt-link></h3>
				<h3>{{localeAltName(island.names)}}</h3>
				<div><p v-html="island.description"></p></div>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
export default {
	props: {
		island: Object
	}
}
</script>
