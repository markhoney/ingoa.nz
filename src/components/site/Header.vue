<template>
	<header>
		<slot />
		<site-menu class="pt-2" />
	</header>
</template>

<static-query>
	query {
		metadata {
			siteName
		}
	}
</static-query>

<script>
	import Search from './search/Search.vue';
	import SiteMenu from './Menu.vue';
	export default {
		components: {Search, SiteMenu},
		props: ['title'],
	};
</script>
