<template>
	<div>
		<h1>{{$page.island.name.locale.en}} ({{$page.island.name.locale.mi}})</h1>
	</div>
</template>

<page-query>
	query island($id: ID!) {
		island(id: $id) {
			id
			name {
				locale {
					en
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
				title: this.$page.island.name.locale.en,
			}
		},
	};
</script>
