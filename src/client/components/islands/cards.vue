<template>
	<v-layout row wrap>
		<v-flex v-for="island in islands" :key="island._id" xs12 sm6 md4 class="pa-2">
			<island :id="island._id" />
		</v-flex>
	</v-layout>
</template>

<script>
	import gql from 'graphql-tag';
	import island from '@/components/islands/card.vue';

	export default {
		components: {
			island,
		},
		apollo: {
			islands: gql`{
				islands {
					_id
				}
			}`,
		},
	};
</script>
