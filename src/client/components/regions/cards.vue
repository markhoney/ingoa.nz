<template>
	<v-layout row wrap>
		<v-flex v-for="region in regions" :key="region._id" xs12 sm6 md4 class="pa-2">
			<!--<region :id="region._id" />-->
			<region :data="region" />
		</v-flex>
	</v-layout>
</template>

<script>
	import gql from 'graphql-tag';
	import region from '@/components/regions/card.vue';

	export default {
		components: {
			region,
		},
		props: {
			field: String,
			value: String,
			data: Array,
		},
		apollo: {
			query: {
				skip() {
					return (this.data ? true : false);
				},
				query: gql`query regions($field: String, $value: String, $lang: String) {
					regions(filter: [{field: $field, value: $value}], lang: $lang) {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
						zones {
							_id
							title {
								en
								mi
							}
							slug {
								en
								mi
							}
						}
						images {
							landscape
						}
					}
				}`,
				update: response => response.regions,
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
			regions: function() {
				return this.data || this.query;
			}
		}
	};
</script>
