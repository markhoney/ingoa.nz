<template>
	<v-card v-if="speaker">
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0">
					<nuxt-link :to="localePath({name: 'speaker-speaker', params: {speaker: speaker.code}})">
						{{localeTitle(speaker.title)}}
					</nuxt-link>
				</h3>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		props: {
			code: String,
		},
		apollo: {
			speaker: {
				query: gql`query speaker($code: String) {
					speaker(filter: {code: $code}) {
						_id
						code
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						code: this.code,
					}
				},
			},
		},
	};
</script>
