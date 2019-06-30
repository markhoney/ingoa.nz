<template>
	<v-layout row wrap>
		<v-flex v-for="map in maps" :key="map.code" class="pa-2">
			<h2 class="display-1 mb-0">{{localeTitle(map.title)}}</h2>
			<h3 class="headline mb-0">{{localeAltTitle(map.title)}}</h3>
			<imagemap :code="map.code" :hash="true" />
		</v-flex>
	</v-layout>
</template>

<script>
	import imagemap from '@/components/maps/image/map.vue';

	export default {
		components: {
			imagemap
		},
		props: {
			maps: Array
		},
	}
</script>
