<template>
	<section>
		<div v-for="region in regions" :key="region._id">
			<h2>{{localeName(region.name)}}</h2>
			<zone field="region_id" :value="region._id" />
		</div>
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import zone from '@/components/zones/list.vue';
	export default {
		components: {
			zone,
		},
		apollo: {
			regions: {
				query: gql`query regions {
					regions {
						_id
						name {
							en
							mi
						}
					}
				}`,
			},
		},
	};
</script>
