<template>
	<section>
		<template v-for="region in regions">
			<h2 class="headline mt5 mb4" :key="region.code">{{localeNames(region.names)}}</h2>
			<zones :zones="region.zones" :cards="false" :key="region.code"/>
		</template>
	</section>
</template>

<script>
import zones from '~/components/zones.vue'

export default {
	components: {
    zones
  },
	props: {
		regions: Array
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
