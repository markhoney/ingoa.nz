<template>
	<section class="container">
		<h1 class="display-2 mt5 mb4">{{$tc('zone', 2) | titlecase}}</h1>
		<zones />
	</section>
</template>

<script>
	import zones from '@/components/zones/lists.vue';
	export default {
		components: {
			zones,
		},
		head() {
			return {
				title: this.caseTitle(this.$tc('zone', 2)),
			};
		},
	};
</script>
