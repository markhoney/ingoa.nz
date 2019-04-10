<template>
	<v-card v-if="island">
		<!--<nuxt-link :to="localePath({name: 'island-island', params: {island: island.code}})">
			<v-img :src="island.images.landscape" height="160" />
			<v-img :src="require('/static/' + island.images.landscape)" height="160" />
		</nuxt-link>-->
		<!-- height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0">
					<nuxt-link v-if="island" :to="localePath({name: 'island-island', params: {island: island.code}})">{{localeName(island.name)}}</nuxt-link>
				</h3>
				<h3>{{localeAltName(island.name)}}</h3>
				<div>
					<p v-html="island.description"/>
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
						name {
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
