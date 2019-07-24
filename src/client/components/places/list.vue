<template>
	<searchlist v-if="items" :data="items" />
</template>

<script>
	import searchlist from '@/components/base/list/search.vue';

	export default {
		components: {
			searchlist,
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
							title {
								en
								mi
							}
							placename {
								slug {
									en
									mi
								}
								zone {
									title {
										en
										mi
									}
									slug {
										en
										mi
									}
								}
								part {
									title {
										en
										mi
									}
									slug {
										en
										mi
									}
								}
								island {
									title {
										en
										mi
									}
									slug {
										en
										mi
									}
								}
								names {
									title {
										en
										mi
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
								text: place.placename.names[0].title.mi + (this.context ? ' (' + this.localeCurrent(zonepartisland.title) + ')' : ""),
								link: this.localePath({name: 'placename-zone-placename', params: {zone: this.localeCurrent(zonepartisland.slug), placename: this.localeCurrent(place.placename.slug)}}),
							},
							subtitle: {
								text: this.localeCurrent(place.title),
							}
						};
					});
				}
			},
		},
	};
</script>
