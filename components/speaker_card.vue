<template>
	<v-card>
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'speakers-speaker', params: {speaker: speaker.code}})">{{speaker.name}}</nuxt-link></h3>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
export default {
	props: {
		speaker: Object
	}
}
</script>
