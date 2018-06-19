<template>
	<v-layout row wrap>
		<v-flex v-for="imagemap in imagemaps" v-bind:key="imagemap.code" class="pa-2">
			<imagemap :imagemap="imagemap"/>
		</v-flex>
	</v-layout>
</template>

<script>
import imagemap from '~/components/imagemap.vue'

export default {
	props: {
		imagemaps: Object
	},
	components: {
    imagemap
  }
}
</script>
