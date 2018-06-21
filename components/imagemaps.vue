<template>
	<v-layout row wrap>
		<v-flex v-for="imagemap in imagemaps" v-bind:key="imagemap.code" class="pa-2">
			<h2 class="display-1 mb-0">{{localeName(imagemap.name)}}</h2>
			<h3 class="headline mb-0">{{localeAltName(imagemap.name)}}</h3>
			<imagemap :imagemap="imagemap"/>
		</v-flex>
	</v-layout>
</template>

<script>
import imagemap from '~/components/imagemap.vue'

export default {
	props: {
		imagemaps: Array
	},
	components: {
    imagemap
  }
}
</script>
