<template>
	<section v-if="feature">
		<h2>{{localeCurrent(feature.title.locale)}}</h2>
		<wikipedia v-if="feature.notes && feature.notes.wikipedia" :text="localeCurrent(feature.notes.wikipedia)" :link="localeCurrent(feature.links.wikipedia)" source="Wikipedia" />
		<places field="feature.slug" :value="$route.params.feature" context />
	</section>
</template>

<script>
	import places from '@/components/places/list.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';

	const param = "feature";

	export default {
		components: {
			places,
			wikipedia,
		},
		apollo: {
			feature: {
				query() {
					return this.$gql`query feature($field: String, $value: String) {
						feature(filter: [{field: $field, value: $value}]) {
							_id
							title {
								locale {
									en
									mi
								}
							}
							slug {
								en
								mi
							}
							links {
								wikipedia {
									en
									mi
								}
							}
							notes {
								wikipedia {
									en
									mi
								}
							}
						}
					}`;
				},
				variables() {
					return {
						field: this.field,
						value: this.value,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		computed: {
			field: function() {
				return "slug." + this.$i18n.locale;
			},
			value: function() {
				return this.$route.params[param];
			},
		},
		watch: {
			feature: function(data) {
				this.$store.dispatch('i18n/setRouteParams', {en: {[param]: data.slug.en}, mi: {[param]: data.slug.mi}});
			},
		},
		head() {
			return {
				title: (this[param] ? this.localeCurrent(this[param].title.locale) + ' (' + this.$tc(param) + ')' : ''),
			};
		},
	};
</script>
