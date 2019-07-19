<template>
	<searchlist :data="places" />
</template>

<script>
	import gql from 'graphql-tag';
	import searchlist from '@/components/base/list/search.vue';

	export default {
		components: {
			searchlist,
		},
		props: {
			field: String,
			value: String,
			data: Array,
		},
		apollo: {
			query: {
				skip() {
					return (this.items ? true : false);
				},
				query: gql`query places($field: String, $value: String, $lang: String) {
					places(filter: [{field: $field, value: $value}], lang: $lang, sort: {field: "placename.slug.mi"}) {
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
				}`,
				update: response => response.places,
				variables() {
					return {
						field: this.field,
						value: this.value,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		computed: {
			places: function() {
				const places = this.data || this.query;
				if (places) {
					return places.map(place => {
						const zonepartisland = (place.placename.zone || place.placename.part || place.placename.island);
						return {
							_id: place._id,
							title: {
								text: place.placename.names[0].title.mi + ' (' + this.localeCurrent(zonepartisland.title) + ')',
								link: this.localePath({name: 'placename-zone-placename', params: {zone: this.localeCurrent(zonepartisland.slug), placename: this.localeCurrent(place.placename.slug)}}),
							},
							subtitle: {
								text: this.localeCurrent(place.title),
							}
						};
					});
				}
			}
		},
	}
</script>
