<template>
	<gmap :cluster="true" />
</template>

<script>
	import gmap from '@/components/maps/google/places.vue';

	export default {
		components: {
			gmap,
		},
		head() {
			return {
				title: "All locations",
			};
		},
	};
</script>
