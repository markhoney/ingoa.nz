<template>
	<section v-if="feature">
		<h2>{{localeCurrent(feature.title)}}</h2>
		<wikipedia v-if="feature.notes.wikipedia" :text="feature.notes.wikipedia" :link="feature.links.wikipedia" source="Wikipedia" />
		<!--<ul>
			<li v-for="place in feature.places" :key="place._id">{{localeCurrent(place.title)}}</li>
		</ul>-->
		<places field="feature.slug" :value="$route.params.feature" />
		<!--<places :items="feature.places" />-->
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import places from '@/components/places/list.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';

	export default {
		components: {
			places,
			wikipedia,
		},
		apollo: {
			feature: {
				query: gql`query feature($slug: String, $lang: String) {
					feature(find: {slug: $slug}, lang: $lang) {
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
						slug: this.$route.params.feature,
						lang: this.$i18n.locale,
					};
				},
			},
		},
		head() {
			return {
				title: (this.feature ? this.localeCurrent(this.feature.title) + ' (' + this.$tc('feature') + ')' : ''),
			};
		},
	};
</script>
