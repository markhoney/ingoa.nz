<template>
	<v-card v-if="speaker">
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0">
					<nuxt-link :to="localePath({name: 'speaker-speaker', params: {speaker: localeCurrent(speaker.slug)}})">
						{{localeCurrent(speaker.title)}}
					</nuxt-link>
				</h3>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>

	export default {
		props: {
			field: String,
			value: String,
			data: Object,
		},
		apollo: {
			remote: {
				skip() {
					return (this.data ? true : false);
				},
				query() {
					return this.$gql`query speaker($field: String, $value: String) {
						speaker(filter: [{field: $field, value: $value}]) {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
							}
						}
					}`;
				},
				update: response => response.speaker,
				variables() {
					return {
						field: this.field,
						value: this.value,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$eventbus.$emit("loading", countModifier);
				},
			},
		},
		computed: {
			speaker: function() {
				return this.data || this.remote;
			},
		},
	};
</script>
