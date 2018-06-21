<template>
	<v-layout row wrap>
		<v-flex xs12 sm6 md4 v-for="island in islands" v-bind:key="island.code" class="pa-2">
			<island :island="island"/>
		</v-flex>
	</v-layout>
</template>

<script>
import island from '~/components/island.vue'

export default {
	props: {
		islands: Array
	},
	components: {
    island
  }
}
</script>



