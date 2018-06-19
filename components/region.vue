<template>
	<v-card>
		<nuxt-link :to="localePath({name: 'regions-region', params: {region: region.code}})"><v-card-media :src="region.image.landscape" height="180px"></v-card-media></nuxt-link>
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'regions-region', params: {region: region.code}})">{{region.name}}</nuxt-link></h3>
				<h3 v-if="region.tereo != region.name">{{region.tereo}}</h3>
			</div>
		</v-card-title>
		<v-card-actions>
			<v-btn flat color="orange"><nuxt-link :to="localePath({name: 'regions-region', params: {region: region.code}})">{{$tc('detail', 2) | titlecase}}</nuxt-link></v-btn>
			<v-btn flat color="orange"><nuxt-link :to="localePath({name: 'regions-region-zones', params: {region: region.code}})">{{$tc('zone', 2) | titlecase}}</nuxt-link></v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	props: {
		region: Object
	},
}
console.log("Region");
console.log(this.region);
</script>
