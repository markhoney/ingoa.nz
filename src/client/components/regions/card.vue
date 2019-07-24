<template>
	<v-card v-if="region">
		<nuxt-link :to="localePath({name: 'region-region', params: {region: localeCurrent(region.slug)}})" style="text-decoration: none;">
			<v-img :src="region.images.landscape" height="160" class="white--text" style="padding: 20px; filter: grayscale(50%);" alt="">
				<!--<h2 class="display-1 mb-0" style="clear: both;">{{localeCurrent(region.title)}}</h2>
				<h3 class="mb-1 headline">{{localeOther(region.title, '&nbsp;')}}</h3>-->
				<!--<h2 class="display-3 mb-0">{{$tc('region', 1) | initialcase}}</h2>-->
				<h3 v-if="single" style="text-transform: uppercase; font-size: 4em; text-align: center;">{{$tc('region', 1)}}</h3>
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
					<!--<comma v-if="region.zones" field="region._id" :value="region._id">
						{{$tc('zone', 2) | initialcase}}:
					</comma>-->
					<comma v-if="items" :data="items">
						{{$tc('zone', 2) | initialcase}}:
					</comma>
				</div>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
	import comma from '@/components/base/list/comma.vue';
	//import comma from '@/components/zones/comma.vue';

	export default {
		components: {
			comma,
		},
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
					return this.$gql`query region($field: String, $value: String) {
						region(filter: [{field: $field, value: $value}]) {
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
								slug {
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
				update: response => response.region,
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
			region: function() {
				return this.data || this.remote;
			},
			items: function() {
				if (this.region && this.region.zones) {
					return this.region.zones.map(zone => {
						return {
							_id: zone._id,
							title: this.localeCurrent(zone.title),
							link: this.localePath({name: 'zone-zone', params: {zone: this.localeCurrent(zone.slug)}}),
						};
					});
				}
			}
		}
	};
</script>
