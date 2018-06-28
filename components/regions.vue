<template>
	<v-layout row wrap>
		<v-flex xs12 sm6 md4 v-for="region in regions" v-bind:key="region.code" class="pa-2">
			<region :region="region"/>
		</v-flex>
	</v-layout>
</template>

<script>
import region from '~/components/region_card.vue'

export default {
	components: {
    region
  },
	props: {
		regions: Array
	}
}
</script>
