<template>
	<v-toolbar-items @mouseover="hover = true" @mouseleave="hover = false" style="min-width: 120px;">
		<nuxt-link v-for="locale in $i18n.locales" :key="locale.code" :to="switchLocalePath(locale.code)" @click="$eventbus.$emit('language_changed');" :class="[(hover && $i18n.locale == locale.code) || (!hover && $i18n.locale != locale.code) ? 'hidden' : '', 'mt-4']" style="color: #ffffff;">
			<figure>
				<img :src="locale.image" alt="">
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
	.hidden {
		display: none;
	}
</style>