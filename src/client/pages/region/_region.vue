<template>
	<section v-if="region">
		<h1 class="display-2 mt-5">
			{{localeTitle(region.title)}}
		</h1>
		<h2 v-if="localeBothTitles(region.title)" class="display-1 mb-4">
			{{localeAltTitle(region.title)}}
		</h2>
		<h3 class="display-1 mt-5 mb-4">
			{{$tc('zone', 2) | titlecase}}
		</h3>
		<zones field="region._id" :value="region._id" />
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import zones from '@/components/zones/cards.vue';

	const field = "code";

	export default {
		components: {
			zones,
		},
		apollo: {
			region: {
				query: gql`query region($value: String) {
					region(filter: {${field}: $value}) {
						_id
						code
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						value: this.$route.params.region,
					}
				},
			},
		},
		head() {
			return {
				title: (this.region ? this.localeTitle(this.region.title) : ""),
			};
		},
	};
</script>
