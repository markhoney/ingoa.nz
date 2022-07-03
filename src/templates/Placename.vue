<template>
	<div>
		<h1>{{$page.item.names[0].name.locale.en}} ({{$page.item.names[0].name.locale.mi}})</h1>
	</div>
</template>

<page-query>
	query item($id: ID!) {
		item: placename(id: $id) {
			id
			names {
				name {
					locale {
						en
						mi
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
				title: this.$page.item.names[0].name.locale.en,
			}
		},
	};
</script>
