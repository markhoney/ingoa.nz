<template>
	<ul>
		<li v-for="item in $clean($page.items)" :key="item.id">
			<g-link :to="'/districts/' + item.id">{{item.name.locale.en}}</g-link> ({{item.name.locale.mi}})
		</li>
	</ul>
</template>

<page-query>
	{
		items: allDistrict(sortBy: "id", order: ASC) {
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
				title: 'Districts',
			}
		},
	};
</script>
