<template>
	<v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app temporary>
		<v-list>
			<v-list-tile>
				<v-list-tile-title>
					<search />
				</v-list-tile-title>
			</v-list-tile>
			<v-list-group prepend-icon="public">
				<v-list-tile slot="activator">
					<v-list-tile-title>{{$tc('location', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-group v-for="island in islands" :key="island.code" no-action sub-group>
					<v-list-tile slot="activator" :to="localePath({name: 'island-island', params: {island: island.code}})">
						<v-list-tile-title>{{localeName(island.name)}}</v-list-tile-title>
					</v-list-tile>
					<template v-if="island.regions">
						<v-list-group v-for="region in island.regions" :key="region.code" no-action sub-group>
							<v-list-tile slot="activator" :to="localePath({name: 'region-region', params: {region: region.code}})">
								<v-list-tile-title>{{localeName(region.name)}}</v-list-tile-title>
								<!--<v-list-tile-action>
									<v-icon>layers</v-icon>
								</v-list-tile-action>-->
							</v-list-tile>
							<template v-if="region.zones">
								<v-list-tile v-for="zone in region.zones" :key="zone.code" :to="localePath({name: 'zone-zone', params: {zone: zone.code}})">
									<v-list-tile-title>{{localeName(zone.name)}}</v-list-tile-title>
									<!--<v-list-tile-action>
										<v-icon>terrain</v-icon>
									</v-list-tile-action>-->
								</v-list-tile>
							</template>
						</v-list-group>
					</template>
				</v-list-group>
			</v-list-group>
			<v-list-group prepend-icon="map">
				<v-list-tile slot="activator" :to="localePath('map')">
					<v-list-tile-title>{{$tc('map', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-tile v-for="map in maps" :key="map.code" :to="localePath({name: 'map-map', params: {map: map.code}})">
					<v-list-tile-title>{{localeName(map.name)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>
			<v-list-group prepend-icon="account_circle">
				<v-list-tile slot="activator" :to="localePath('speaker')">
					<v-list-tile-title>{{$tc('speaker', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-tile v-for="speaker in speakers" :key="speaker.code" :to="localePath({name: 'speaker-speaker', params: {speaker: speaker.code}})">
					<v-list-tile-title>{{localeName(speaker.name)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>
			<v-list-group prepend-icon="place">
				<v-list-tile slot="activator" :to="localePath('feature')">
					<v-list-tile-title>{{$tc('feature', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-tile v-for="feature in features" :key="feature.code" :to="localePath({name: 'feature-feature', params: {feature: feature.code}})">
					<v-list-tile-title>{{localeName(feature.name)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>
			<!--<v-list-group prepend-icon="home">
				<v-list-tile slot="activator" :to="localePath('group')">
					<v-list-tile-title>{{$tc('group', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-tile v-for="group in groups" :key="group.code" :to="localePath({name: 'group-zone-group', params: {zone: zone_id, group: group.code}})">
					<v-list-tile-title>{{localeName(group.name)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>-->
			<v-list-group prepend-icon="people">
				<v-list-tile slot="activator" :to="localePath('iwi')">
					<v-list-tile-title>{{$tc('iwi', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-tile v-for="iwi in ngaiwi" :key="iwi.code" :to="localePath({name: 'iwi-iwi', params: {iwi: iwi.code}})">
					<v-list-tile-title>{{localeName(iwi.name)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
	import gql from 'graphql-tag';
	import search from '@/components/menu/search.vue';

	export default {
		components: {
			search,
		},
		data() {
			return {
			};
		},
		apollo: {
			islands: gql`{
				islands {
					_id
					code
					name {
						en
						mi
					}
					regions {
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
					}
				}
			}`,
			maps: gql`{
				maps {
					_id
					code
					name {
						en
						mi
					}
				}
			}`,
			speakers: gql`{
				speakers {
					_id
					code
					name {
						en
						mi
					}
				}
			}`,
			groups: gql`{
				groups {
					_id
					code
					zone_id
					name {
						en
						mi
					}
				}
			}`,
			features: gql`{
				features {
					_id
					code
					name {
						en
						mi
					}
				}
			}`,
			ngaiwi: gql`{
				ngaiwi {
					_id
					code
					name {
						en
						mi
					}
				}
			}`,
			/*drawer: gql`query {
				drawer @client {
					visible
				}
			}`,*/
		},
		computed: {
			drawer: {
				get() {
					return this.$store.state.drawer;
				},
				set(v) {
					this.$store.commit('setDrawer', v);
				}
			}
		}
	};
</script>
