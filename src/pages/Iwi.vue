<template>
	<ul>
		<li v-for="item in $clean($page.items)" :key="item.id">
			<g-link :to="'/iwi/' + item.id">{{item.name.locale.en}}</g-link> ({{item.name.locale.mi}})
		</li>
	</ul>
</template>

<page-query>
	{
		items: allIwi(sortBy: "id", order: ASC) {
			edges {
				node {
					id
					name {
						locale {
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
				title: 'Iwi',
			}
		},
	};
</script>
