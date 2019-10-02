<template>
	<v-card v-if="island">
		<nuxt-link :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})" style="text-decoration: none;">
			<v-img :src="require(`@/assets${island.images.landscape}`)" height="160" class="white--text" style="padding: 20px; filter: grayscale(50%);" alt="">
				<h3 v-if="single" style="text-transform: uppercase; font-size: 4em; text-align: center;">{{$tc('island', 1)}}</h3>
			</v-img>
		</nuxt-link>
		<!-- height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0">
					<nuxt-link v-if="island" :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})">{{localeCurrent(island.name.locale)}}</nuxt-link>
				</h3>
				<h3>{{localeOther(island.name.locale)}}</h3>
				<div>
					<p v-html="island.description" />
				</div>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
	//import islandCard from '@/gql/islandCard.gql';
	
	export default {
		props: {
			field: String,
			value: String,
			data: Object,
			single: {
				type: Boolean,
				value: false,
			},
		},
		apollo: {
			remote: {
				skip() {
					return (this.data ? true : false);
				},
				query() {
					return this.$gql`query island($field: String, $value: String) {
						island(filter: [{field: $field, value: $value}]) {
							_id
							slug {
								en
								mi
							}
							name {
								locale {
									en
									mi
								}
							}
							notes {
								description {
									en
									mi
								}
							}
							images {
								landscape
							}
						}
					}`;
				},
				update: response => response.island,
				variables() {
					return {
						field: this.field,
						value: this.value,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		computed: {
			island: function() {
				return this.data || this.remote;
			},
		},
	};
</script>
