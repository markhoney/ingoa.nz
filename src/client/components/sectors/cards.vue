<template>
	<v-layout row wrap>
		<v-flex v-for="sector in sectors" :key="sector._id" xs12 sm6 md4 class="pa-2">
			<!--<sector field="_id" :value="sector._id" />-->
			<sector :data="sector" />
		</v-flex>
	</v-layout>
</template>

<script>
	import sector from '@/components/sectors/card.vue';

	export default {
		components: {
			sector,
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
					return this.$gql`query sectors($field: String, $value: String) {
						sectors(filter: [{field: $field, value: $value}]) {
							_id
							slug {
								en
								mi
							}
							title {
								locale {
									en
									mi
								}
							}
							zones {
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
							}
							images {
								landscape
							}
						}
					}`;
				},
				update: response => response.sectors,
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
			sectors: function() {
				return this.data || this.remote;
			}
		}
	};
</script>
