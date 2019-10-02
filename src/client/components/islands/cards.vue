<template>
	<v-layout row wrap>
		<v-flex v-for="island in islands" :key="island._id" xs12 sm6 md4 class="pa-2">
			<!--<island field="_id" :value="island._id" />-->
			<island :data="island" />
		</v-flex>
	</v-layout>
</template>

<script>
	import island from '@/components/islands/card.vue';
	//import islandCard from '@/gql/islandCard.gql';

	export default {
		components: {
			island,
		},
		apollo: {
			islands: {
				query() {
					return this.$gql`{
						islands {
							_id
							slug {
								en
								mi
							}
							name {
								locale {
									en
									mi
								}
							}
							notes {
								description {
									en
									mi
								}
							}
							images {
								landscape
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
	};
</script>
