<template>
	<v-card v-if="island">
		<nuxt-link :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})">
			<v-img :src="island.images.landscape" height="160" class="white--text" style="padding: 20px; filter: grayscale(50%);" alt="">
				<slot />
			</v-img>
		</nuxt-link>
		<!-- height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0">
					<nuxt-link v-if="island" :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})">{{localeCurrent(island.title)}}</nuxt-link>
				</h3>
				<h3>{{localeOther(island.title)}}</h3>
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
			id: String,
		},
		apollo: {
			island: {
				query: gql`query island($id: String) {
					island(find: {_id: $id}) {
						_id
						slug {
							en
							mi
						}
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
						id: this.id,
					}
				},
			},
		},
	};
</script>
