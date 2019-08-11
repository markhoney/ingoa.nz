<template>
	<v-layout row wrap>
		<v-flex v-for="map in maps" :key="map._id" class="pa-2">
			<h2 class="display-1 mb-0">{{localeCurrent(map.title.locale)}}</h2>
			<h3 class="headline mb-0">{{localeOther(map.title.locale)}}</h3>
			<imagemap field="_id" :value="map._id" hash />
		</v-flex>
	</v-layout>
</template>

<script>
	import imagemap from '@/components/maps/image/map.vue';

	export default {
		components: {
			imagemap,
		},
		props: {
			maps: Array
		},
	};
</script>
