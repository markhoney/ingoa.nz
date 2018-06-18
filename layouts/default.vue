<template>
	<v-app v-cloak>
		<v-toolbar>
			<v-toolbar-title><h1><a href="/">{{$t('title')}}</a></h1></v-toolbar-title>
			<h2>{{$t('subtitle')}}</h2>
			<v-spacer></v-spacer>
			<v-toolbar-items class="hidden-sm-and-down">
				<v-btn flat><nuxt-link :to="localePath({name: 'region'})">{{$tc('region', 2) | titlecase}}</nuxt-link></v-btn>
				<v-btn flat><nuxt-link :to="localePath({name: 'zone'})">{{$tc('zone', 2) | titlecase}}</nuxt-link></v-btn>
				<v-btn flat><nuxt-link :to="localePath({name: 'speaker'})">{{$tc('speaker', 2) | titlecase}}</nuxt-link></v-btn>
			</v-toolbar-items>
			<v-spacer></v-spacer>
			<nuxt-link v-for="locale in $i18n.locales" v-if="locale.code !== $i18n.locale" :key="locale.code" :to="switchLocalePath(locale.code)">{{locale.name}}</nuxt-link>
			<nuxt-link v-for="locale in $i18n.locales" v-if="locale.code !== $i18n.locale" :key="locale.code" :to="switchLocalePath(locale.code)" v-html="locale.svg"></nuxt-link>
		</v-toolbar>
    <nuxt/>
		<v-footer>
			<p v-html="$t('copyright')"></p>
			<p v-html="$t('datalicense')"></p>
			<p v-html="$t('codelicense')"></p>
		</v-footer>
	</v-app>
</template>
