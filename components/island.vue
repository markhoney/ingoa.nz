<template>
	<v-card>
		<nuxt-link :to="localePath({name: 'island-code', params: {code: island.code}})"><v-card-media :src="island.landscape"></v-card-media></nuxt-link><!--  height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'island-code', params: {code: island.code}})">{{island.name}}</nuxt-link></h3>
				<h3>{{island.tereo}}</h3>
				<div><p v-html="island.description"></p></div>
			</div>
		</v-card-title>
		<v-card-actions>
			<v-btn flat color="orange"><nuxt-link :to="localePath({name: 'island-code', params: {code: island.code}})">{{$tc('detail', 2) | titlecase}}</nuxt-link></v-btn>
			<v-btn flat color="orange">Regions</v-btn>
			<v-btn flat color="orange">Zones</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	props: {
		island: Object
	},
}
</script>
