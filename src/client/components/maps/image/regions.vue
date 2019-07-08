<template>
	<section class="pa-2 my-5 elevation-4">
		<!--<h3 class="display-1 mt-5 mb-4">{{$tc('map', 1) | titlecase}}</h3>-->
		<imagemap :id="id" :hash="true" class="text-xs-center" />
		<h3 class="display-1 mt-5 mb-4">{{$tc('region', 2) | titlecase}}</h3>
		<regions field="map._id" :value="id" />
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import imagemap from '@/components/maps/image/map.vue';
	import regions from '@/components/regions/cards.vue';

	export default {
		components: {
			imagemap,
			regions,
		},
		props: {
			id: String,
		},
	};
</script>
