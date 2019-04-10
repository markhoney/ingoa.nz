<template>
	<GmapMap ref="gmap" :center="{lat: -40, lng: 175}" :zoom="7" map-type-id="satellite" style="width: 100%; height: 100vh">
		<gmap-info-window :options="{pixelOffset: {width: 0, height: -35}}" :position="info.position" :opened="info.open" @closeclick="info.open = false">
			<a href="#">{{info.text}}</a>
			<br>
			{{info.name}}
		</gmap-info-window>
		<!--<gmap-cluster>-->
		<template v-for="place in placenames.places">
			<GmapMarker v-for="feature in place.features.filter(f => f.location)" ref="markers" :key="place.code + '-' + feature.name" :position="feature.location.position"
				@click="toggleinfo(place.code + '-' + feature.name, feature.location.position, feature.name + ' (' + feature.kind + ')', feature.location.name + ' (' + feature.location.kind + ')')" />
			<!-- v-if="'location' in feature" -->
		</template>
		<!--</gmap-cluster>-->
	</GmapMap>
</template>

<script>
	import gql from 'graphql-tag';
	import {gmapApi} from 'vue2-google-maps';

	export default {
		props: {
			field: String,
			value: String,
		},
		apollo: {
			placenames: {
				query: gql`query placenames($field: String, $value: String) {
					placenames(filter: {field: $field, value: $value}) {
						_id
						code
						name {
							en
							mi
						}
						places {

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
					text: '',
					name: '',
				},
			};
		},
		computed: {
			google: gmapApi,
		},
		mounted() {
			this.$refs.gmap.$mapPromise.then(map => {
				this.geocoder = new this.google.maps.Geocoder();
				var bounds = new this.google.maps.LatLngBounds();
				this.$refs.markers.forEach(marker => {
				//for (var marker in this.$refs.markers) {
					marker = this.$refs.markers[marker];
					marker.$markerPromise.then(marker => {
						bounds.extend(marker.position);
						map.fitBounds(bounds);
					});
				});
			});
		},
		methods: {
			toggleinfo: function(id, position, text, name) {
				this.info.position = position;
				this.info.text = text;
				this.info.name = name;
				if (this.info.current === id) {
					this.info.open = !this.info.open;
				} else {
					this.info.open = true;
					this.info.id = id;
				}
			},
		},
		getLocation: function(address) {
			this.geocoder.geocode({address: address}, (results, status) => {
				if (status === 'OK') {
					this.currentLocation.lat = results[0].geometry.location.lat();
					this.currentLocation.lng = results[0].geometry.location.lng();
				}
			});
		},
	};
</script>
