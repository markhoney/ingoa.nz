<template>
	<fragment>
		<site-header />
		<main class="flex-shrink-0">
			<div class="container" style="padding: 80px 15px 0">
				<slot />
			</div>
		</main>
		<site-footer />
	</fragment>
</template>

<script>
	import {Fragment} from 'vue-fragment';
	import SiteHeader from '@/components/site/Header.vue';
	import SiteFooter from '@/components/site/Footer.vue';
	export default {
		components: {Fragment, SiteHeader, SiteFooter},
	}
</script>
