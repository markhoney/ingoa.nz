<template>
	<v-app>
		<v-toolbar prominent extended> <!--  height="auto" -->
			<v-toolbar-title>
				<h1><a href="/">{{$t('title')}}</a></h1>
				<div class="subheading">{{$t('subtitle')}}</div>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<v-btn flat><nuxt-link :to="localePath({name: 'islands'})">{{$tc('island', 2) | titlecase}}</nuxt-link></v-btn>
				<v-btn flat><nuxt-link :to="localePath({name: 'regions'})">{{$tc('region', 2) | titlecase}}</nuxt-link></v-btn>
				<v-btn flat><nuxt-link :to="localePath({name: 'zones'})">{{$tc('zone', 2) | titlecase}}</nuxt-link></v-btn>
				<v-btn flat><nuxt-link :to="localePath({name: 'speakers'})">{{$tc('speaker', 2) | titlecase}}</nuxt-link></v-btn>
			</v-toolbar-items>
			<v-spacer></v-spacer>
			<nuxt-link v-for="locale in $i18n.locales" v-if="locale.code !== $i18n.locale" :key="locale.code" :to="switchLocalePath(locale.code)" class="mt-4 text-xs-center">
				<img :src="locale.image" /><br />
				{{locale.name}}
			</nuxt-link>
			<!--<nuxt-link v-for="locale in $i18n.locales" v-if="locale.code !== $i18n.locale" :key="locale.code" :to="switchLocalePath(locale.code)" v-html="locale.svg"></nuxt-link>-->
		</v-toolbar>
		<v-container>
	    <nuxt/>
		</v-container>
		<v-footer height="auto">
			<v-card class="flex" v-html="$t('copyright')"></v-card>
			<v-card class="flex" v-html="$t('datalicense')"></v-card>
			<v-card class="flex" v-html="$t('codelicense')"></v-card>
		</v-footer>
	</v-app>
</template>

<style scoped>

</style>
