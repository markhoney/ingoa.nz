<template>
	<v-layout row wrap>
		<v-flex xs12 sm6 md4 class="pa-2">
			<template v-for="speaker in speakers">
				<speaker v-if="speaker._id !== 'sp_37'" :data="speakers" :key="speaker._id" />
			</template>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
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
					return this.$gql`query speakers($field: String, $value: String) {
						speakers(filter: [{field: $field, value: $value}]) {
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
						}
					}`;
				},
				update: response => response.speakers,
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
			speakers: function() {
				return this.data || this.remote;
			},
		},
	};
</script>
