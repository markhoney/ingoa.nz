<template>
	<leaflet cluster />
</template>

<script>
	import leaflet from '@/components/maps/leaflet/places.vue';

	export default {
		components: {
			leaflet,
		},
		head() {
			return {
				title: "All locations",
			};
		},
	};
</script>
