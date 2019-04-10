<template>
	<v-parallax :src="image" height="150" style="border-radius: 20px; padding-top: 30px;" class="px-3">
		<h2 class="display-3">{{localeName(names)}}</h2>
		<h3 class="display-2 mb-5">{{localeAltName(names)}}</h3>
		<h2 class="text-xs-right display-2">{{id}}</h2>
	</v-parallax>
</template>

<script>
	export default {
		props: {
			image: String,
			names: Object,
			id: String
		}
	}
</script>
