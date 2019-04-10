<template>
	<section>
		<h1 class="display-2">
			{{$tc('region', 2) | titlecase}}
		</h1>
		<template v-for="island in islands">
			<v-subheader :key="island.code" class="display-1 mt-5 mb-3">
				<nuxt-link :to="localePath({name: 'island-island', params: {island: island.code}})">
					{{localeName(island.name)}}
				</nuxt-link>
			</v-subheader>
			<v-subheader v-if="localeBothNames(island.name)" :key="island.name.mi" class="display-1 mb-4">
				{{localeAltName(island.name)}}
			</v-subheader>
			<regions :key="island.code" field="island_id" :value="island._id" />
		</template>
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import regions from '@/components/regions/cards.vue';

	export default {
		components: {
			regions,
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
					}
				}
			}`,
		},
		head() {
			return {
				title: 'Regions',
			};
		},
	};
</script>
