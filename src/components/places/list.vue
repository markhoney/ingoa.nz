<template>
	<list v-if="items" :data="items" />
</template>

<script>
	import list from '@/components/base/list/description.vue';

	export default {
		components: {
			list,
		},
		props: {
			field: String,
			value: String,
			data: Array,
			context: {
				type: Boolean,
				value: false,
			},
		},
		apollo: {
			remote: {
				skip() {
					return (this.data ? true : false);
				},
				query() {
					return this.$gql`query places($field: String, $value: String) {
						places(filter: [{field: $field, value: $value}], sort: {field: "placename.slug.mi"}) {
							_id
							name {
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
								}
								part {
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
								}
								island {
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
								}
								names {
									name {
										locale {
											en
											mi
										}
									}
								}
							}
						}
					}`;
				},
				update: response => response.places,
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
			places: function() {
				return this.data || this.remote;
			},
			items: function() {
				if (this.places) {
					return this.places.map(place => {
						const zonepartisland = (place.placename.zone || place.placename.part || place.placename.island);
						return {
							_id: place._id,
							title: {
								text: place.placename.names[0].name.locale.mi + (this.context ? ' (' + this.localeCurrent(zonepartisland.name.locale) + ')' : ""),
								link: this.localePath({name: 'placename-zone-placename', params: {zone: this.localeCurrent(zonepartisland.slug), placename: this.localeCurrent(place.placename.slug)}}),
							},
							subtitle: {
								text: this.localeCurrent(place.name.locale),
							}
						};
					});
				}
			},
		},
	};
</script>
