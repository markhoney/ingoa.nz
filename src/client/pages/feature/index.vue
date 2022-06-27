<template>
	<section>
		<h1>
			{{$tc('feature', 2) | titlecase}}
		</h1>
		<features />
	</section>
</template>

<script>
	import features from '@/components/features/list.vue';

	export default {
		components: {
			features,
		},
		head() {
			return {
				title: this.caseTitle(this.$tc('feature', 2)),
			};
		},
	};
</script>
