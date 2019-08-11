<template>
	<section v-if="group">
		<h2>{{this.localeCurrent(group.title.locale)}}</h2>
		<wikipedia v-if="group.notes && group.notes.wikipedia" :text="localeCurrent(group.notes.wikipedia)" :link="localeCurrent(group.links.wikipedia)" source="Wikipedia" />
		<places :data="group.places" />
	</section>
</template>

<script>
	import places from '@/components/places/list.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';

	const param = "group";

	export default {
		components: {
			places,
			wikipedia,
		},
		apollo: {
			group: {
				query() {
					return this.$gql`query group($field: String, $value: String, $zone: String) {
						group(filter: [{field: $field, value: $value}, {field: "zone.slug", value: $zone}]) {
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
							places {
								_id
								title {
									locale {
										en
										mi
									}
								}
								placename {
									slug {
										en
										mi
									}
									zone {
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
									}
									part {
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
									}
									island {
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
									}
									names {
										title {
											locale {
												en
												mi
											}
										}
									}
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
			group: function(data) {
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
