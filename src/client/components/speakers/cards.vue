<template>
	<v-layout row wrap>
		<v-flex xs12 sm6 md4 class="pa-2">
			<template v-for="speaker in speakers">
				<speaker v-if="speaker.code != 'hugh_young'" :code="speaker.code" :key="speaker.code" />
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
				query: gql`query speakers($field: String, $value: String) {
					speakers(filter: {field: $field, value: $value}) {
						_id
						code
					}
				}`,
				variables() {
					return {
						field: this.field,
						value: this.value,
					}
				},
			},
		},
	}
</script>
