<template>
	<v-layout row wrap>
		<v-flex xs12 sm6 md4 class="pa-2">
			<template v-for="speaker in speakers">
				<speaker v-if="speaker._id != 'sp_37'" :id="speaker._id" :key="speaker._id" />
			</template>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		props: {
			field: String,
			value: String
		},
		apollo: {
			speakers: {
				query: gql`query speakers($field: String, $value: String, $lang: String) {
					speakers(filter: [{field: $field, value: $value}], lang: $lang) {
						_id
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
	}
</script>
