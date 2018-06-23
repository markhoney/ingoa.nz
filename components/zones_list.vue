<template>
	<ul>
		<li v-for="zone in zones" v-bind:key="zone.code">
			<nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})">{{localeNames(zone.names)}}</nuxt-link>
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		zones: Array
	}
}
</script>

<style scoped>
	ul {
		height: 100px;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
	}
</style>
