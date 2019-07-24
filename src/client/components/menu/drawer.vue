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
				<v-list-group v-for="island in islands" :key="island._id" no-action sub-group>
					<v-list-tile slot="activator" :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})">
						<v-list-tile-title>{{localeCurrent(island.title)}}</v-list-tile-title>
					</v-list-tile>
					<template v-if="island.regions">
						<v-list-group v-for="region in island.regions" :key="region._id" no-action sub-group>
							<v-list-tile slot="activator" :to="localePath({name: 'region-region', params: {region: localeCurrent(region.slug)}})">
								<v-list-tile-title>{{localeCurrent(region.title)}}</v-list-tile-title>
								<!--<v-list-tile-action>
									<v-icon>layers</v-icon>
								</v-list-tile-action>-->
							</v-list-tile>
							<template v-if="region.zones">
								<v-list-tile v-for="zone in region.zones" :key="zone._id" :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})">
									<v-list-tile-title>{{localeCurrent(zone.title)}}</v-list-tile-title>
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
				<v-list-tile v-for="map in maps" :key="map._id" :to="localePath({name: 'map-map', params: {map: localeCurrent(map.slug)}})">
					<v-list-tile-title>{{localeCurrent(map.title)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>
			<v-list-group prepend-icon="account_circle">
				<v-list-tile slot="activator" :to="localePath('speaker')">
					<v-list-tile-title>{{$tc('speaker', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-tile v-for="speaker in speakers" :key="speaker._id" :to="localePath({name: 'speaker-speaker', params: {speaker: localeCurrent(speaker.slug)}})">
					<v-list-tile-title>{{localeCurrent(speaker.title)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>
			<v-list-group prepend-icon="place">
				<v-list-tile slot="activator" :to="localePath('feature')">
					<v-list-tile-title>{{$tc('feature', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-tile v-for="feature in features" :key="feature._id" :to="localePath({name: 'feature-feature', params: {feature: localeCurrent(feature.slug)}})">
					<v-list-tile-title>{{localeCurrent(feature.title)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>
			<!--<v-list-group prepend-icon="home">
				<v-list-tile slot="activator" :to="localePath('group')">
					<v-list-tile-title>{{$tc('group', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-tile v-for="group in groups" :key="group._id" :to="localePath({name: 'group-zone-group', params: {zone: localeCurrent(zone.slug), group: localeCurrent(group.slug)}})">
					<v-list-tile-title>{{localeCurrent(group.title)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>-->
			<v-list-group prepend-icon="people">
				<v-list-tile slot="activator" :to="localePath('tribe')">
					<v-list-tile-title>{{$tc('tribe', 2) | titlecase}}</v-list-tile-title>
				</v-list-tile>
				<v-list-tile v-for="tribe in tribes" :key="tribe._id" :to="localePath({name: 'tribe-tribe', params: {tribe: localeCurrent(tribe.slug)}})">
					<v-list-tile-title>{{localeCurrent(tribe.title)}}</v-list-tile-title>
				</v-list-tile>
			</v-list-group>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
	//import search from '@/components/search/dynamic.vue';
	import search from '@/components/search/autocomplete.vue';

	export default {
		components: {
			search,
		},
		apollo: {
			islands: {
				query() {
					return this.$gql`{
						islands {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
							}
							regions {
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
									slug {
										en
										mi
									}
									title {
										en
										mi
									}
								}
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
			maps: {
				query() {
					return this.$gql`{
						maps {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
			speakers: {
				query() {
					return this.$gql`{
						speakers {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
			groups: {
				query() {
					return this.$gql`{
						groups {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
			features: {
				query() {
					return this.$gql`{
						features {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
			tribes: {
				query() {
					return this.$gql`{
						tribes {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		computed: {
			drawer: {
				get() {
					return this.$store.state.drawer;
				},
				set(v) {
					this.$store.commit('drawerSet', v);
				},
			},
		},
	};
</script>
