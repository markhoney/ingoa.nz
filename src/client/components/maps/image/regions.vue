<template>
	<section class="pa-2 my-5 elevation-4">
		<!--<h3 class="display-1 mt-5 mb-4">{{$tc('map', 1) | titlecase}}</h3>-->
		<imagemap field="_id" :value="id" hash class="text-xs-center" />
		<h3 class="display-1 mt-5 mb-4">{{$tc('sector', 2) | titlecase}}</h3>
		<sectors field="map._id" :value="id" />
	</section>
</template>

<script>
	import imagemap from '@/components/maps/image/map.vue';
	import sectors from '@/components/sectors/cards.vue';

	export default {
		components: {
			imagemap,
			sectors,
		},
		props: {
			id: String,
		},
	};
</script>
