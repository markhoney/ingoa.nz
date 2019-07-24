<template>
	<section>
		<h1 class="display-2">
			{{$tc('region', 2) | titlecase}}
		</h1>
		<template v-for="island in islands">
			<v-subheader :key="island._id" class="display-1 mt-5 mb-3">
				<nuxt-link :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})">
					{{localeCurrent(island.title)}}
				</nuxt-link>
			</v-subheader>
			<v-subheader v-if="localeBothExist(island.title)" :key="island.title.mi" class="display-1 mb-4">
				{{localeOther(island.title)}}
			</v-subheader>
			<regions :key="island._id" field="island._id" :value="island._id" />
		</template>
	</section>
</template>

<script>
	import regions from '@/components/regions/cards.vue';

	export default {
		components: {
			regions,
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
							title {
								en
								mi
							}
							regions {
								_id
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		head() {
			return {
				title: this.caseTitle(this.$tc('region', 2)),
			};
		},
	};
</script>
