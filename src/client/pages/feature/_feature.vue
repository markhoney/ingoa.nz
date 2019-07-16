<template>
	<section v-if="feature">
		<h2>{{localeCurrent(feature.title)}}</h2>
		<p v-if="feature.notes && feature.notes.wikipedia">{{feature.notes.wikipedia}}</p>
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

	export default {
		components: {
			places,
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
