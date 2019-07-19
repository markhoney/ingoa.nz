<template>
	<v-card v-if="island">
		<nuxt-link :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})" style="text-decoration: none;">
			<v-img :src="island.images.landscape" height="160" class="white--text" style="padding: 20px; filter: grayscale(50%);" alt="">
				<h3 v-if="single" style="text-transform: uppercase; font-size: 4em; text-align: center;">{{$tc('island', 1)}}</h3>
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
			slug: String,
			single: {
				type: Boolean,
				value: false,
			},
			data: Object,
		},
		apollo: {
			query: {
				skip() {
					return (this.data ? true : false);
				},
				query: gql`query island($id: String) {
					island(filter: [{field: "_id", value: $id}]) {
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
				update: response => response.island,
				variables() {
					return {
						id: this.id,
					}
				},
			},
		},
		computed: {
			island: function() {
				return this.data || this.query;
			}
		}
	};
</script>
