<template>
	<ul>
		<li v-for="island in $clean($page.allIsland)" :key="island.id">
			<g-link :to="'/' + island.id">{{island.name.locale.en}}</g-link> ({{island.name.locale.mi}})
		</li>
	</ul>
</template>

<page-query>
	{
		allIsland(sortBy: "id", order: ASC) {
			edges {
				node {
					id
					name {
						locale {
							en
							mi
						}
					}
				}
			}
		}
	}
</page-query>

<script>
	export default {
		metaInfo () {
			return {
				title: 'Islands',
			}
		},
	};
</script>
