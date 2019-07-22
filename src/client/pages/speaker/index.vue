<template>
	<section>
		<h1>
			{{$tc('speaker', 2) | titlecase}}
		</h1>
		<speakers />
	</section>
</template>

<script>
	import speakers from '@/components/speakers/list.vue';

	export default {
		components: {
			speakers,
		},
		head() {
			return {
				title: this.caseTitle(this.$tc('speaker', 2)),
			};
		},
	};
</script>
