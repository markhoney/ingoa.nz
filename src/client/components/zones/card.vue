<template>
	<v-card v-if="zone">
		<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})">
			<v-img :src="zone.images.landscape" height="160" alt="" />
		</nuxt-link><!-- height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0">
					<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})">
						{{localeCurrent(zone.title)}}
					</nuxt-link>
				</h3>
				<h3>{{localeOther(zone.title)}}</h3>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		props: {
			id: String,
			data: Object,
		},
		apollo: {
			query: {
				skip() {
					return (this.data ? true : false);
				},
				query: gql`query zone($id: String) {
					zone(find: {_id: $id}) {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
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
			zone: function() {
				return this.data || this.query;
			},
		},
	};
</script>
