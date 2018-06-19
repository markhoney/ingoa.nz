<template>
	<v-card>
		<nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})"><v-card-media :src="zone.image.landscape" height="180px"></v-card-media></nuxt-link><!--  height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})">{{zone.name}}</nuxt-link></h3>
				<h3 v-if="zone.tereo !- zone.name">{{zone.tereo}}</h3>
				<div><p v-html="zone.description"></p></div>
			</div>
		</v-card-title>
		<v-card-actions>
			<v-btn flat color="orange"><nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})">{{$tc('detail', 2) | titlecase}}</nuxt-link></v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	props: {
		zone: Object
	},
}
</script>
