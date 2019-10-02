<template>
	<v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app temporary>
		<v-list>
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title>
						<search />
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-group prepend-icon="public">
				<template v-slot:activator>
					<v-list-item-content>
						<v-list-item-title>{{$tc('location', 2) | titlecase}}</v-list-item-title>
					</v-list-item-content>
				</template>
				<v-list-group v-for="island in islands" :key="island._id" no-action sub-group>
					<template v-slot:activator>
						<v-list-item-content :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})">
							<v-list-item-title>{{localeCurrent(island.name.locale)}}</v-list-item-title>
						</v-list-item-content>
					</template>
					<v-list-group v-for="sector in island.sectors" :key="sector._id" no-action sub-group>
						<template v-slot:activator>
							<v-list-item-content>
								<v-list-item :to="localePath({name: 'sector-sector', params: {sector: localeCurrent(sector.slug)}})">
									<v-list-item-title>{{localeCurrent(sector.name.locale)}}</v-list-item-title>
									<!--<v-list-item-action>
										<v-icon>layers</v-icon>
									</v-list-item-action>-->
								</v-list-item>
							</v-list-item-content>
						</template>
						<v-list-item v-for="zone in sector.zones" :key="zone._id" :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})">
							<v-list-item-content>
								<v-list-item-title>{{localeCurrent(zone.name.locale)}}</v-list-item-title>
								<!--<v-list-item-action>
									<v-icon>terrain</v-icon>
								</v-list-item-action>-->
							</v-list-item-content>
						</v-list-item>
					</v-list-group>
				</v-list-group>
			</v-list-group>
			<v-list-group prepend-icon="map">
				<v-list-item slot="activator" :to="localePath('map')">
					<v-list-item-title>{{$tc('map', 2) | titlecase}}</v-list-item-title>
				</v-list-item>
				<v-list-item v-for="map in maps" :key="map._id" :to="localePath({name: 'map-map', params: {map: localeCurrent(map.slug)}})">
					<v-list-item-title>{{localeCurrent(map.name.locale)}}</v-list-item-title>
				</v-list-item>
			</v-list-group>
			<v-list-group prepend-icon="account_circle">
				<v-list-item slot="activator" :to="localePath('speaker')">
					<v-list-item-title>{{$tc('speaker', 2) | titlecase}}</v-list-item-title>
				</v-list-item>
				<v-list-item v-for="speaker in speakers" :key="speaker._id" :to="localePath({name: 'speaker-speaker', params: {speaker: localeCurrent(speaker.slug)}})">
					<v-list-item-title>{{localeCurrent(speaker.name.locale)}}</v-list-item-title>
				</v-list-item>
			</v-list-group>
			<v-list-group prepend-icon="place">
				<v-list-item slot="activator" :to="localePath('feature')">
					<v-list-item-title>{{$tc('feature', 2) | titlecase}}</v-list-item-title>
				</v-list-item>
				<v-list-item v-for="feature in features" :key="feature._id" :to="localePath({name: 'feature-feature', params: {feature: localeCurrent(feature.slug)}})">
					<v-list-item-title>{{localeCurrent(feature.name.locale)}}</v-list-item-title>
				</v-list-item>
			</v-list-group>
			<!--<v-list-group prepend-icon="home">
				<v-list-item slot="activator" :to="localePath('group')">
					<v-list-item-title>{{$tc('group', 2) | titlecase}}</v-list-item-title>
				</v-list-item>
				<v-list-item v-for="group in groups" :key="group._id" :to="localePath({name: 'group-zone-group', params: {zone: localeCurrent(zone.slug), group: localeCurrent(group.slug)}})">
					<v-list-item-title>{{localeCurrent(group.name.locale)}}</v-list-item-title>
				</v-list-item>
			</v-list-group>-->
			<v-list-group prepend-icon="people">
				<v-list-item slot="activator" :to="localePath('tribe')">
					<v-list-item-title>{{$tc('tribe', 2) | titlecase}}</v-list-item-title>
				</v-list-item>
				<v-list-item v-for="tribe in tribes" :key="tribe._id" :to="localePath({name: 'tribe-tribe', params: {tribe: localeCurrent(tribe.slug)}})">
					<v-list-item-title>{{localeCurrent(tribe.name.locale)}}</v-list-item-title>
				</v-list-item>
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
							name {
								locale {
									en
									mi
								}
							}
							sectors {
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
							name {
								locale {
									en
									mi
								}
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
							name {
								locale {
									en
									mi
								}
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
							name {
								locale {
									en
									mi
								}
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
							name {
								locale {
									en
									mi
								}
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
							name {
								locale {
									en
									mi
								}
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
					return this.$store.state.drawer || null;
				},
				set(v) {
					this.$store.commit('drawerSet', v);
				},
			},
		},
	};
</script>
