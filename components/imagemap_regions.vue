<template>
	<section class="pa-2 my-5 elevation-4">
		<h2 class="display-1 mb-0 text-xs-center">{{localeName(imagemap.names)}}</h2>
		<h3 class="headline mb-0 text-xs-center mb-3">{{localeAltName(imagemap.names)}}</h3>
		<p class="text-xs-center">Please click on a zone on the map below to be taken to that zone (hover over the map to see the names of the zones), or select a region below the map to view the zones for that region.</p>
		<h3 class="display-1 mt-5 mb-4">{{$tc('map', 1) | titlecase}}</h3>
		<imagemap :imagemap="imagemap" :hash="true" class="text-xs-center"/>
		<h3 class="display-1 mt-5 mb-4">{{$tc('region', 2) | titlecase}}</h3>
		<regions :regions="regions"/>
	</section>
</template>

<script>
import regions from '~/components/regions.vue'
import imagemap from '~/components/imagemap.vue'

export default {
	components: {
		imagemap,
		regions
  },
	props: {
		imagemap: Object,
		regions: Array
	}
}
</script>
