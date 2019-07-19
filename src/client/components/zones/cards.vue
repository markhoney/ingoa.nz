<template>
	<v-layout row wrap>
		<v-flex v-for="zone in zones" :key="zone._id" xs12 sm6 md4 class="pa-2">
			<!--<zone :id="zone._id" />-->
			<zone :data="zone" />
		</v-flex>
	</v-layout>
</template>

<script>
	import gql from 'graphql-tag';
	import zone from '@/components/zones/card.vue';

	export default {
		components: {
			zone,
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
				query: gql`query zones($field: String, $value: String, $lang: String) {
					zones(filter: [{field: $field, value: $value}], lang: $lang) {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
						images {
							landscape
						}
					}
				}`,
				update: response => response.zones,
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
			zones: function() {
				return this.data || this.query;
			}
		}
	};
</script>
