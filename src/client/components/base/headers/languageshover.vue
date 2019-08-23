<template>
	<v-toolbar-items @mouseover="hover = true" @mouseleave="hover = false">
		<nuxt-link v-for="locale in $i18n.locales" :key="locale.code" :to="switchLocalePath(locale.code)" :class="[(hover && $i18n.locale == locale.code) || (!hover && $i18n.locale != locale.code) ? 'hidden' : '', 'mt-4']">
			<figure>
				<img :src="require(`@/assets${locale.image}`)" alt="" align="right">
				<figcaption>{{($i18n.locale != locale.code ? "Switch to " : "") + locale.name}}</figcaption>
			</figure>
		</nuxt-link>
	</v-toolbar-items>
</template>

<script>
	export default {
		data() {
			return {
				hover: false,
			};
		},
	};

</script>

<style scoped>
	.v-toolbar__items {
		min-width: 100px;
	}
	.nuxt-link-active {
		display: block;
		float: right;
		width: 100%;
		color: #ffffff;
	}
	figcaption {
		text-align: right;
	}
	.hidden {
		display: none;
	}
</style>