<template>
	<section v-if="feature">
		<h2>{{localeCurrent(feature.title)}}</h2>
		<wikipedia v-if="feature.notes && feature.notes.wikipedia" :text="feature.notes.wikipedia" :link="feature.links.wikipedia" source="Wikipedia" />
		<places field="feature.slug" :value="$route.params.feature" context />
	</section>
</template>

<script>
	import places from '@/components/places/list.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';

	export default {
		components: {
			places,
			wikipedia,
		},
		apollo: {
			remote: {
				skip() {
					return (this.data ? true : false);
				},
				query() {
					return this.$gql`query feature($field: String, $value: String) {
						feature(filter: [{field: $field, value: $value}]) {
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
					}`;
				},
				update: response => response.feature,
				variables() {
					return {
						field: "slug",
						value: this.$route.params.feature,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$eventbus.$emit("loading", countModifier);
				},
			},
		},
		computed: {
			feature: function() {
				return this.data || this.remote;
			},
		},
		head() {
			return {
				title: (this.feature ? this.localeCurrent(this.feature.title) + ' (' + this.$tc('feature') + ')' : ''),
			};
		},
	};
</script>
