<template>
	<GmapMap ref="gmap" :center="{lat: -40, lng: 175}" :zoom="7" map-type-id="satellite" style="width: 100%; height: 80vh">
		<gmap-info-window :options="{pixelOffset: {width: 0, height: -35}}" :position="info.position" :opened="info.open" @closeclick="info.open = false">
			<nuxt-link v-if="info.id" :to="localePath({name: 'placename-zone-placename', params: {zone: info.zone, placename: info.placename}})">{{info.title}}</nuxt-link>
			<br>
			{{info.text}}
		</gmap-info-window>
		<template v-if="placenames">
			<gmap-cluster v-if="cluster">
				<template v-for="placename in placenames.filter(placename => placename.places)">
					<GmapMarker v-for="place in placename.places.filter(place => place.location)" ref="markers" :key="place._id" :position="place.location.position" @click="toggleinfo(placename, place)" />
				</template>
			</gmap-cluster>
			<template v-else>
				<template v-for="placename in placenames.filter(placename => placename.places)">
					<GmapMarker v-for="place in placename.places.filter(place => place.location)" ref="markers" :key="place._id" :position="place.location.position" @click="toggleinfo(placename, place)" />
				</template>
			</template>
		</template>
	</GmapMap>
</template>

<script>
	import gql from 'graphql-tag';
	import {gmapApi} from 'vue2-google-maps';

	export default {
		props: {
			cluster: {
				type: Boolean,
				default: false,
			},
			field: String,
			value: String,
		},
		apollo: {
			placenames: {
				query: gql`query placenames($field: String, $value: String) {
					placenames(filter: {field: $field, value: $value}) {
						_id
						code
						zone {
							code
						}
						places {
							_id
							title {
								en
								mi
							}
							location {
								position {
									lat
									lng
								}
							}
							feature {
								title {
									en
									mi
								}
							}
						}
					}
				}`,
				variables() {
					return {
						field: this.field,
						value: this.value
					}
				},
			},
		},
		data() {
			return {
				info: {
					open: false,
					position: null,
					id: null,
					zone: null,
					title: null,
					placename: null,
					text: null,
				},
			};
		},
		computed: {
			google: gmapApi
		},
		mounted() {
			this.$refs.gmap.$mapPromise.then(map => {
				this.$map = map;
			});
			this.$watch(() => {
				return this.$refs.markers;
			},
			(val) => {
				console.log("Watch");
				this.zoomMap();
			});
		},
		methods: {
			toggleinfo: function(placename, place) {
				this.info.position = place.location.position;
				this.info.title = this.localeTitle(place.title);
				this.info.placename = placename.code;
				this.info.zone = placename.zone.code || '';
				this.info.text = this.localeTitle(place.feature.title);
				if (this.info.id === place._id) {
					this.info.open = !this.info.open;
				} else {
					this.info.open = true;
					this.info.id = place._id;
				}
			},
			zoomMap: function() {
				const bounds = new google.maps.LatLngBounds();
				if (this.$refs.markers) {
					this.$refs.markers.forEach(marker => {
						marker.$markerPromise.then(marker => {
							bounds.extend(marker.position);
							this.$map.fitBounds(bounds);
						});
					});
				}
			},
		},
		watch: {
			placenames: function() {
				//this.zoomMap();
			}
		},
	};
</script>
