<template>
	<div>
		<h1>{{$page.item.name.locale.en}} ({{$page.item.name.locale.mi}})</h1>
	</div>
</template>

<page-query>
	query item($id: ID!) {
		item: iwi(id: $id) {
			id
			name {
				locale {
					mi
				}
			}
		}
	}
</page-query>

<script>
	export default {
		metaInfo () {
			return {
				title: this.$page.item.name.locale.en,
			}
		},
	};
</script>
