<template>
	<v-toolbar-items class="hidden-sm-and-down">
		<v-menu offset-y>
			<v-btn primary dark slot="activator">
				{{$tc('location', 2) | titlecase}}
			</v-btn>
			<v-list dense>
				<v-menu offset-x open-on-hover v-for="island in islands" :key="island.code">
					<v-list-tile slot="activator" :to="localePath({name: 'island-island', params: {island: island.code}})">
						<v-list-tile-title>{{localeName(island.name)}}</v-list-tile-title>
						<v-list-tile-action class="justify-end">
							<v-icon>play_arrow</v-icon>
						</v-list-tile-action>
					</v-list-tile>
					<v-list dense>
						<v-list-tile v-for="region in island.regions" :key="region.code" :to="localePath({name: 'region-region', params: {region: region.code}})">
							<v-list-tile-title>{{localeName(region.name)}}</v-list-tile-title>
						</v-list-tile>
					</v-list>
				</v-menu>
			</v-list>
		</v-menu>
		<v-menu top offset-y>
			<v-btn flat slot="activator" :to="localePath('speaker')">
				{{$tc('speaker', 2) | titlecase}}
			</v-btn>
		</v-menu>
		<v-menu top offset-y>
			<v-btn flat slot="activator" :to="localePath('iwi')">
				{{$tc('iwi', 2) | titlecase}}
			</v-btn>
		</v-menu>
		<v-menu top offset-y>
			<v-btn flat slot="activator" :to="localePath('feature')">
				{{$tc('feature', 2) | titlecase}}
			</v-btn>
		</v-menu>
		<v-menu top offset-y>
			<v-btn flat slot="activator" :to="localePath('group')">
				{{$tc('group', 2) | titlecase}}
			</v-btn>
		</v-menu>
	</v-toolbar-items>
</template>

<script>
	import gql from 'graphql-tag';
	export default {
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
					}
				}
			}`,
		},
	};
</script>
