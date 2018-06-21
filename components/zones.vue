<template>
	<v-layout row wrap>
		<v-flex xs12 sm6 md4 v-for="zone in zones" v-bind:key="zone.code" class="pa-2">
			<zone :zone="zone"/>
		</v-flex>
	</v-layout>
</template>

<script>
import zone from '~/components/zone.vue'

export default {
	props: {
		zones: Array
	},
	components: {
    zone
  }
}
</script>
