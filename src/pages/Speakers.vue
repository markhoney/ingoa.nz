<template>
	<ul>
		<li v-for="item in $clean($page.items)" :key="item.id">
			<g-link :to="'/speakers/' + item.id">{{item.name.locale.en}}</g-link> ({{item.name.locale.mi}})
		</li>
	</ul>
</template>

<page-query>
	{
		items: allSpeaker(sortBy: "id", order: ASC) {
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
				title: 'Speakers',
			}
		},
	};
</script>
