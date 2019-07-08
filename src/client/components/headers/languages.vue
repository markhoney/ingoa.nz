<template>
	<v-toolbar-items>
		<nuxt-link v-for="locale in $i18n.locales.filter(locale => locale.code !== $i18n.locale)" :key="locale.code" :to="switchLocalePath(locale.code)" class="mt-4 text-xs-center" style="color: #ffffff;">
			<figure>
				<img :src="locale.image" alt="">
				<figcaption>Switch to {{locale.name}}</figcaption>
			</figure>
		</nuxt-link>
	</v-toolbar-items>
</template>
