<template>
	<h2>{{localeCurrent(placename.names[0].name.locale)}}</h2>
</template>

<script>
	const param = "placename";

	export default {
		apollo: {
			placename: {
				query() {
					return this.$gql`query placename($field: String, $value: String) {
						placename(filter: [{field: $field, value: $value}]) {
							_id
							slug {
								en
								mi
							}
							names {
								name {
									locale {
										en
										mi
									}
								}
							}
							places {
								name {
									locale {
										en
										mi
									}
								}
							}
							notes {
								name {
									en
									mi
								}
								speech {
									en
									mi
								}
								spelling {
									en
									mi
								}
								place {
									en
									mi
								}
							}
							addendum_zones {
								_id
							}
							see {
								zone {
									_id
									name {
										locale {
											en
											mi
										}
									}
								}
								placename {
									_id
								}
								type
							}
							previous {
								slug {
									en
									mi
								}
							}
							next {
								slug {
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
						zone: this.zone,
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
			zone: function() {
				return this.$route.params.zone;
			},
		},
		watch: {
			placename: function(data) {
				this.$store.dispatch('i18n/setRouteParams', {en: {[param]: data.slug.en}, mi: {[param]: data.slug.mi}});
			},
		},
		head() {
			return {
				title: (this[param] ? this.localeCurrent(this[param].names[0].name.locale) + ' (' + this.$tc(param) + ')' : ''),
			};
		},
	};
</script>