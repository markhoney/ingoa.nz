<template>
	<v-card>
		<nuxt-link :to="localePath({name: 'speakers-speaker', params: {speaker: speaker.code}})"><v-card-media :src="speaker.image.portrait" height="280px"></v-card-media></nuxt-link>
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'speakers-speaker', params: {speaker: speaker.code}})">{{speaker.name}}</nuxt-link></h3>
				<h3>{{localeAltName(region.names, '&nbsp;')}}</h3>
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
