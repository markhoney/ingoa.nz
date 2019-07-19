<template>
	<v-card style="border-radius: 20px;">
		<v-card-text>
			<blockquote class="blockquote">
				{{text}}
			</blockquote>
		</v-card-text>
		<v-card-actions v-if="link">
			<v-layout justify-end mr-4 mb-4>
				-&nbsp;<a :href="link" target="_blank">{{source || "Source"}}</a>
			</v-layout>
		</v-card-actions>
	</v-card>
</template>

<script>
	export default {
		props: {
			text: String,
			link: String,
			source: String,
		},
	};
</script>

<style scoped>
	blockquote {
		font-family: sans-serif;
		font-size: 14px;
	}
</style>
