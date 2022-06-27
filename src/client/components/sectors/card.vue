<template>
	<v-card v-if="sector">
		<nuxt-link :to="localePath({name: 'sector-sector', params: {sector: localeCurrent(sector.slug)}})" style="text-decoration: none;">
			<v-img :src="require(`~/assets${sector.images.landscape}`)" height="160" class="white--text" style="padding: 20px; filter: grayscale(50%);" alt="">
				<!--<h2 class="display-1 mb-0" style="clear: both;">{{localeCurrent(sector.name.locale)}}</h2>
				<h3 class="mb-1 headline">{{localeOther(sector.name.locale, '&nbsp;')}}</h3>-->
				<!--<h2 class="display-3 mb-0">{{$tc('sector', 1) | initialcase}}</h2>-->
				<h3 v-if="single" style="text-transform: uppercase; font-size: 4em; text-align: center;">{{$tc('sector', 1)}}</h3>
			</v-img>
		</nuxt-link>
		<v-card-title primary-title>
			<div>
				<h2 class="headline mb-0" style="clear: both;">
					<nuxt-link :to="localePath({name: 'sector-sector', params: {sector: localeCurrent(sector.slug)}})">
						{{localeCurrent(sector.name.locale)}}
					</nuxt-link>
				</h2>
				<h3 class="mb-1">
					{{localeOther(sector.name.locale, '&nbsp;')}}
				</h3>
				<div>
					<!--<comma v-if="sector.zones" field="sector._id" :value="sector._id">
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
					return this.$gql`query sector($field: String, $value: String) {
						sector(filter: [{field: $field, value: $value}]) {
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
							zones {
								_id
								name {
									locale {
										en
										mi
									}
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
				update: response => response.sector,
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
			sector: function() {
				return this.data || this.remote;
			},
			items: function() {
				if (this.sector && this.sector.zones) {
					return this.sector.zones.map(zone => {
						return {
							_id: zone._id,
							title: this.localeCurrent(zone.name.locale),
							link: this.localePath({name: 'zone-zone', params: {zone: this.localeCurrent(zone.slug)}}),
						};
					});
				}
			}
		}
	};
</script>
