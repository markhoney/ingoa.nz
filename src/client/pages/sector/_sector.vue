<template>
	<section v-if="sector">
		<h1 class="display-2 mt-5">
			{{localeCurrent(sector.name.locale)}}
		</h1>
		<h2 v-if="localeBothExist(sector.name.locale)" class="display-1 mb-4">
			{{localeOther(sector.name.locale)}}
		</h2>
		<wikipedia v-if="sector.notes.wikipedia" :text="localeCurrent(sector.notes.wikipedia)" :link="localeCurrent(sector.links.wikipedia)" source="Wikipedia" />
		<h3 class="display-1 mt-5 mb-4">
			{{$tc('zone', 2) | titlecase}}
		</h3>
		<zones field="sector._id" :value="sector._id" />
	</section>
</template>

<script>
	import wikipedia from '@/components/base/textboxes/quote.vue';
	import zones from '@/components/zones/cards.vue';

	const param = "sector";

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
			sector: {
				query() {
					return this.$gql`query sector($field: String, $value: String) {
						sector(filter: [{field: $field, value: $value}]) {
							_id
							name {
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
			sector: function(data) {
				this.$store.dispatch('i18n/setRouteParams', {en: {[param]: data.slug.en}, mi: {[param]: data.slug.mi}});
			},
		},
		head() {
			return {
				title: (this[param] ? this.localeCurrent(this[param].name.locale) + ' (' + this.$tc(param) + ')' : ''),
			};
		},
	};
</script>
