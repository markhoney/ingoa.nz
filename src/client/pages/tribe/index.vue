<template>
	<section>
		<h1>
			{{$tc('tribe', 2) | titlecase}}
		</h1>
		<tribes />
	</section>
</template>

<script>
	import tribes from '@/components/tribes/list.vue';

	export default {
		components: {
			tribes,
		},
		head() {
			return {
				title: this.caseTitle(this.$tc('tribe', 2)),
			};
		},
	};
</script>
