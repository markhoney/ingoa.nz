<template>
	<v-toolbar-items class="hidden-sm-and-down">
		<v-menu top offset-y>
			<template #:activator="{on}">
				<v-btn color="primary" dark v-on="on">{{$tc('location', 2) | titlecase}}</v-btn>
			</template>
			<v-list dense>
				<v-menu offset-x v-for="island in islands" :key="island._id">
					<v-list-item #:activator="{on}" :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})">
						<v-list-item-title v-on="on">{{localeCurrent(island.title.locale)}}</v-list-item-title>
						<v-list-item-action class="justify-end">
							<v-icon>play_arrow</v-icon>
						</v-list-item-action>
					</v-list-item>
					<v-list dense>
						<v-list-item v-for="sector in island.sectors" :key="sector._id" :to="localePath({name: 'sector-sector', params: {sector: localeCurrent(sector.slug)}})">
							<v-list-item-title>{{localeCurrent(sector.title.locale)}}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-list>
		</v-menu>
		<v-menu top offset-y>
			<v-btn primary dark text slot="activator">
				{{$tc('location', 2) | titlecase}}
			</v-btn>
			<v-list dense>
				<v-menu offset-x open-on-hover v-for="island in islands" :key="island._id">
					<v-list-item slot="activator" :to="localePath({name: 'island-island', params: {island: localeCurrent(island.slug)}})">
						<v-list-item-title>{{localeCurrent(island.title.locale)}}</v-list-item-title>
						<v-list-item-action class="justify-end">
							<v-icon>play_arrow</v-icon>
						</v-list-item-action>
					</v-list-item>
					<v-list dense>
						<v-list-item v-for="sector in island.sectors" :key="sector._id" :to="localePath({name: 'sector-sector', params: {sector: localeCurrent(sector.slug)}})">
							<v-list-item-title>{{localeCurrent(sector.title.locale)}}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-list>
		</v-menu>
		<v-menu top offset-y>
			<v-btn text slot="activator" :to="localePath('speaker')">
				{{$tc('speaker', 2) | titlecase}}
			</v-btn>
		</v-menu>
		<v-menu top offset-y>
			<v-btn text slot="activator" :to="localePath('tribe')">
				{{$tc('tribe', 2) | titlecase}}
			</v-btn>
		</v-menu>
		<v-menu top offset-y>
			<v-btn text slot="activator" :to="localePath('feature')">
				{{$tc('feature', 2) | titlecase}}
			</v-btn>
		</v-menu>
		<v-menu top offset-y>
			<v-btn text slot="activator" :to="localePath('group')">
				{{$tc('group', 2) | titlecase}}
			</v-btn>
		</v-menu>
	</v-toolbar-items>
</template>

<script>
	export default {
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
								title {
									locale {
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
		},
	};
</script>
