<template>
	<v-layout row wrap>
		<v-flex xs12 sm6 md4 class="pa-2">
			<template v-for="speaker in speakers">
				<speaker v-if="speaker.code != 'hugh_young'" :speaker="speaker" :key="speaker.code"/>
			</template>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		props: {
			speakers: Object
		}
	}
</script>
