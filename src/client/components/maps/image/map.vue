<template>
	<section v-if="map">
		<h2 :id="map.code" class="display-1 mb-0 text-sm-center">
			<nuxt-link :to="localePath({name: 'map-map', params: {map: localeCurrent(map.slug)}})">{{localeCurrent(map.name.locale)}}</nuxt-link>
		</h2>
		<h3 class="headline mb-0 text-sm-center mb-3">{{localeOther(map.name.locale)}}</h3>
		<img :src="require(`~/assets${map.images.portrait}`)" :alt="localeBoth(map.name.locale)" field="_id" :value="map._id" :usemap="'#map-' + map.code">
		<map :name="'map-' + map.code">
			<template v-for="sector in map.sectors">
				<template v-for="zone in sector.zones">
					<nuxt-link v-for="(area, index) in zone.maplink.mapareas" :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})" :key="zone._id + index"
						:shape="area.shape" :coords="area.coords.map(coord => parseInt(coord)).join(',')" :title="localeBoth(zone.name.locale)" tag="area" />
					<!--:alt="localeBoth(zone.name.locale)" -->
				</template>
			</template>
			<template v-for="link in map.maplinks">
				<nuxt-link v-for="(area, index) in link.mapareas"
					:to="localePath(hash ? {name: 'island-island', params: {island: localeCurrent(map.island.slug)}, hash: '#' + localeCurrent(link.map.slug)} : {name: 'island-island', params: {island: localeCurrent(map.island.slug)}})"
					:key="[link.map._id, index].join('-')" :shape="area.shape" :coords="area.coords.map(coord => parseInt(coord)).join(',')" :title="localeBoth(link.map.name.locale)" tag="area" />
			</template>
		</map>
		<p class="text-sm-center">{{$t('imagemap')}}</p>
	</section>
</template>

<script>

	export default {
		props: {
			field: String,
			value: String,
			hash: {
				type: Boolean,
				default: false,
			},
		},
		head: {
			script: [{src: 'https://unpkg.com/image-map/dist/image-map.js'}],
		},
		apollo: {
			map: {
				query() {
					return this.$gql`query map($field: String, $value: String) {
						map(filter: [{field: $field, value: $value}]) {
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
							dates {
								start
								end
							}
							sectors {
								_id
								zones {
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
									maplink {
										mapareas {
											shape
											coords
										}
									}
								}
							}
							island {
								slug {
									en
									mi
								}
							}
							maplinks {
								map {
									_id
									name {
										locale {
											en
											mi
										}
									}
								}
								mapareas {
									shape
									coords
								}
							}
							images {
								portrait
							}
						}
					}`;
				},
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
		mounted() {
			this.$nextTick(() => {
				if (process.client) {
					window.onNuxtReady(app => {
						ImageMap('img[usemap]');
					});
				}
			});
		},
	};
</script>

<style scoped>
	img {
		display: block;
		max-width: 100%;
		margin: 0 auto;
	}
</style>
