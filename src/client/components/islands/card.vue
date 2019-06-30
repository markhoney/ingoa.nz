<template>
	<v-card v-if="island">
		<nuxt-link :to="localePath({name: 'island-island', params: {island: island.code}})">
			<v-img :src="island.images.landscape" height="160" class="white--text" style="padding: 20px; filter: grayscale(50%);">
				<slot />
			</v-img>
		</nuxt-link>
		<!-- height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0">
					<nuxt-link v-if="island" :to="localePath({name: 'island-island', params: {island: island.code}})">{{localeTitle(island.title)}}</nuxt-link>
				</h3>
				<h3>{{localeAltTitle(island.title)}}</h3>
				<div>
					<p v-html="island.description" />
				</div>
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
			island: {
				query: gql`query island($code: String) {
					island(filter: {code: $code}) {
						_id
						code
						title {
							en
							mi
						}
						description
						images {
							landscape
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
