<template>
		<v-layout :style="'background-image: url(\'' + image + '\')'" row wrap class="headerimage" my-5>
			<v-flex>
				<h2 class="display-3" v-if="to"><nuxt-link :to="localePath(to)">{{localeCurrent(title)}}</nuxt-link></h2>
				<h2 class="display-3" v-else>{{localeCurrent(title)}}</h2>
				<h3 class="display-2 mb-5">{{localeOther(title)}}</h3>
			</v-flex>
			<v-flex>
				<h2 class="display-2 text-sm-right">{{right}}</h2>
			</v-flex>
		</v-layout>
</template>

<script>
	export default {
		props: {
			image: String,
			title: Object,
			to: Object,
			right: String,
		},
	};
</script>

<style scoped>
	.headerimage {
		border-radius: 20px;
		padding: 20px;
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 100%;
		color: white;
	}

	.headerimage h3 {
		margin-bottom: 0 !important;
	}
</style>
