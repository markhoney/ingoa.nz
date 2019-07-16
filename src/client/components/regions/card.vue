<template>
	<v-card v-if="region">
		<nuxt-link :to="localePath({name: 'region-region', params: {region: localeCurrent(region.slug)}})">
			<v-img :src="region.images.landscape" height="160" class="white--text" style="padding: 20px; filter: grayscale(50%);" alt="">
				<!--<h2 class="display-1 mb-0" style="clear: both;">{{localeCurrent(region.title)}}</h2>
				<h3 class="mb-1 headline">{{localeOther(region.title, '&nbsp;')}}</h3>-->
				<!--<h2 class="display-3 mb-0">{{$tc('region', 1) | initialcase}}</h2>-->
			</v-img>
		</nuxt-link>
		<v-card-title primary-title>
			<div>
				<h2 class="headline mb-0" style="clear: both;">
					<nuxt-link :to="localePath({name: 'region-region', params: {region: localeCurrent(region.slug)}})">
						{{localeCurrent(region.title)}}
					</nuxt-link>
				</h2>
				<h3 class="mb-1">
					{{localeOther(region.title, '&nbsp;')}}
				</h3>
				<div>
					<comma v-if="region.zones" field="region._id" :value="region._id">
						{{$tc('zone', 2) | initialcase}}:
					</comma>
				</div>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
	import gql from 'graphql-tag';
	import comma from '@/components/zones/comma.vue';

	export default {
		components: {
			comma,
		},
		props: {
			id: String,
		},
		apollo: {
			region: {
				query: gql`query region($id: String) {
					region(find: {_id: $id}) {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
						zones {
							_id
							title {
								en
								mi
							}
						}
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
		}
	};
</script>
