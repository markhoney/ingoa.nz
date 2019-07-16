<template>
	<section v-if="region">
		<h1 class="display-2 mt-5">
			{{localeCurrent(region.title)}}
		</h1>
		<h2 v-if="localeBothExist(region.title)" class="display-1 mb-4">
			{{localeOther(region.title)}}
		</h2>
		<wikipedia v-if="region.notes.wikipedia" :text="region.notes.wikipedia" :link="region.links.wikipedia" source="Wikipedia" />
		<h3 class="display-1 mt-5 mb-4">
			{{$tc('zone', 2) | titlecase}}
		</h3>
		<zones field="region._id" :value="region._id" />
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import wikipedia from '@/components/base/textboxes/quote.vue';
	import zones from '@/components/zones/cards.vue';

	//const field = "code";

	export default {
		components: {
			wikipedia,
			zones,
		},
		computed: {
			field: function() {
				return "slug." + this.$i18n.locale;
			},
		},
		apollo: {
			region: {
				query: gql`query region($slug: String, $lang: String) {
					region(find: {slug: $slug}, lang: $lang) {
						_id
						title {
							en
							mi
						}
						links {
							wikipedia
						}
						notes {
							wikipedia
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.region,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		head() {
			return {
				title: (this.region ? this.localeCurrent(this.region.title) + ' (' + this.$tc('region') + ')' : ""),
			};
		},
	};
</script>
