<template>
	<v-layout row wrap>
		<v-flex v-for="zone in zones" :key="zone._id" xs12 sm6 md4 class="pa-2">
			<!--<zone field="_id" :value="zone._id" />-->
			<zone :data="zone" />
		</v-flex>
	</v-layout>
</template>

<script>
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
			remote: {
				skip() {
					return (this.data ? true : false);
				},
				query() {
					return this.$gql`query zones($field: String, $value: String) {
						zones(filter: [{field: $field, value: $value}]) {
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
							images {
								landscape
							}
						}
					}`;
				},
				update: response => response.zones,
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
			zones: function() {
				return this.data || this.remote;
			},
		},
	};
</script>
