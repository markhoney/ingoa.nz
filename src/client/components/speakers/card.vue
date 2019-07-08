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
	import gql from 'graphql-tag';

	export default {
		props: {
			id: String,
		},
		apollo: {
			speaker: {
				query: gql`query speaker($id: String) {
					speaker(filter: {_id: $id}) {
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
				}`,
				variables() {
					return {
						id: this.id,
					}
				},
			},
		},
	};
</script>
