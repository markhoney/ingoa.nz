<template>
	<list :data="items" search />
</template>

<script>
	//import gql from 'graphql-tag';
	import list from '@/components/base/list/description.vue';

	export default {
		components: {
			list,
		},
		props: {
			field: String,
			value: String,
			data: Array,
		},
		apollo: {
			remote: {
				skip() {
					return (this.data ? true : false);
				},
				query() {
					return this.$gql`query features($field: String, $value: String) {
						features(filter: [{field: $field, value: $value}]) {
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
							notes {
								wikipedia {
									en
									mi
								}
							}
						}
					}`;
				},
				update: response => response.features,
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
			features: function() {
				return this.data || this.remote;
			},
			items: function() {
				if (this.features) {
					return this.features.map(feature => {
						return {
							_id: feature._id,
							title: {
								text: this.localeCurrent(feature.name.locale),
								link: this.localePath({name: 'feature-feature', params: {feature: this.localeCurrent(feature.slug)}}),
							},
							subtitle: {
								text: (feature.notes ? this.localeCurrentOnly(feature.notes.wikipedia) : ""),
							}
						};
					});
				}
			},
		},
	};
</script>
