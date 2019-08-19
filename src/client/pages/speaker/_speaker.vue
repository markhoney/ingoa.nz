<template>
	<section v-if="speaker">
		<h2>{{this.localeCurrent(this.speaker.name.locale)}}</h2>
		<div v-if="speaker.notes">
			<p v-if="speaker.notes.description">{{speaker.notes.description}}</p>
			<p v-if="speaker.notes.recording">{{speaker.notes.recording}}</p>
		</div>
		<p>{{this.localeCurrent(this.speaker.name.locale)}} spoke for the following Zones:</p>
		<zones :data="speaker.zones" />
	</section>
</template>

<script>
	import zones from '@/components/zones/cards.vue';

	const param = "speaker";

	export default {
		components: {
			zones,
		},
		apollo: {
			speaker: {
				query() {
					return this.$gql`query speaker($field: String, $value: String) {
						speaker(filter: [{field: $field, value: $value}]) {
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
							zones {
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
								images {
									landscape
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
			speaker: function(data) {
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
