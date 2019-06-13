<template>
	<section v-if="region">
		<h1 class="display-2 mt-5">
			{{localeName(region.name)}}
		</h1>
		<h2 v-if="localeBothNames(region.name)" class="display-1 mb-4">
			{{localeAltName(region.name)}}
		</h2>
		<h3 class="display-1 mt-5 mb-4">
			{{$tc('zone', 2) | titlecase}}
		</h3>
		<zones field="region_code" :value="$route.params.region" />
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import zones from '@/components/zones/cards.vue';

	export default {
		components: {
			zones,
		},
		apollo: {
			region: {
				query: gql`query region($code: String) {
					region(filter: {code: $code}) {
						_id
						code
						name {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						code: this.$route.params.region,
					}
				},
			},
		},
		head() {
			return {
				title: (this.region ? this.localeName(this.region.name) : ""),
			};
		},
	};
</script>
