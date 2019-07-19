<template>
	<searchlist :data="items" />
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
		},
		apollo: {
			features: {
				query: gql`query features($field: String, $value: String, $lang: String) {
					features(filter: [{field: $field, value: $value}], lang: $lang) {
						_id
						slug {
							en
							mi
						}
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
						field: this.field,
						value: this.value,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		computed: {
			items: function() {
				if (this.features) {
					return this.features.map(feature => {
						return {
							_id: feature._id,
							title: {
								text: this.localeCurrent(feature.title),
								link: this.localePath({name: 'feature-feature', params: {feature: this.localeCurrent(feature.slug)}}),
							},
							subtitle: {
								text: (feature.notes ? feature.notes.wikipedia : ""),
							}
						};
					});
				}
			}
		},
	}
</script>
