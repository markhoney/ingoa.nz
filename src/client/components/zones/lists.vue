<template>
	<ul>
		<li v-for="zone in zones" :key="zone.code">
			<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: zone.code}})">
				{{localeNames(zone.name)}}
			</nuxt-link>
		</li>
	</ul>
</template>

<script>
	import zone from '@/components/zones/card.vue';

	export default {
		components: {
			zone,
		},
		props: {
			zones: Array,
		},
	};
</script>
