<template>
	<section>
		<h1>
			{{$tc('group', 2) | titlecase}}
		</h1>
		<groups />
	</section>
</template>

<script>
	import groups from '@/components/groups/list.vue';

	export default {
		components: {
			groups,
		},
		head() {
			return {
				title: this.caseTitle(this.$tc('group', 2)),
			};
		},
	};
</script>
