<template>
	<section>
		<h1>
			{{$tc('island', 2) | titlecase}}
		</h1>
		<islands />
	</section>
</template>

<script>
	import islands from '@/components/islands/cards.vue';

	export default {
		components: {
			islands,
		},
		head() {
			return {
				title: 'Islands',
			};
		},
	};
</script>
