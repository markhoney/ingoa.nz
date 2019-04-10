<template>
	<v-card>
		<nuxt-link :to="localePath({name: 'region-region', params: {region: region.code}})">
			<v-img :src="region.images.landscape" height="160" class="white--text" style="padding: 20px; filter: grayscale(50%);">
				<!--<h2 class="display-1 mb-0" style="clear: both;">{{localeName(region.name)}}</h2>
				<h3 class="mb-1 headline">{{localeAltName(region.name, '&nbsp;')}}</h3>-->
				<!--<h2 class="display-3 mb-0">{{$tc('region', 1) | initialcase}}</h2>-->
			</v-img>
		</nuxt-link>
		<v-card-title primary-title>
			<div>
				<h2 class="headline mb-0" style="clear: both;">
					<nuxt-link :to="localePath({name: 'region-region', params: {region: region.code}})">
						{{localeName(region.name)}}
					</nuxt-link>
				</h2>
				<h3 class="mb-1">
					{{localeAltName(region.name, '&nbsp;')}}
				</h3>
				<div>
					<comma v-if="region.zones" field="region_id" :value="region._id">
						Zones:
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
			'code': String,
		},
		apollo: {
			region: {
				query: gql`query region($code: String) {
					region(filter: {code: $code}) {
						_id
						code
						name {
							en
							mi
						}
						zones {
							_id
							code
							name {
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
						code: this.code,
					}
				},
			},
		}
	};
</script>
