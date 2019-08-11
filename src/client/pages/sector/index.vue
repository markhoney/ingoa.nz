<template>
	<section>
		<h1 class="display-2">
			{{$tc('sector', 2) | titlecase}}
		</h1>
		<template v-for="island in islands">
			<v-subheader :key="island._id" class="display-1 mt-5 mb-3">
				<nuxt-link :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})">
					{{localeCurrent(island.title.locale)}}
				</nuxt-link>
			</v-subheader>
			<v-subheader v-if="localeBothExist(island.title.locale)" :key="island.title.locale.mi" class="display-1 mb-4">
				{{localeOther(island.title.locale)}}
			</v-subheader>
			<sectors :key="island._id" field="island._id" :value="island._id" />
		</template>
	</section>
</template>

<script>
	import sectors from '@/components/sectors/cards.vue';

	export default {
		components: {
			sectors,
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
								locale {
									en
									mi
								}
							}
							sectors {
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
				title: this.caseTitle(this.$tc('sector', 2)),
			};
		},
	};
</script>
