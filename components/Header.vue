<template>
  <header>
    <h1>Ngā Ingoa o Aotearoa</h1>
		<h2>{{$t('subtitle')}}</h2>
		<nuxt-link v-for="locale in $i18n.locales" v-if="locale.code !== $i18n.locale" :key="locale.code" :to="switchLocalePath(locale.code)">{{locale.name}}</nuxt-link>
		<!--<nuxt-link :to="switchLocalePath('en')">English</nuxt-link>
		<nuxt-link :to="switchLocalePath('mi')">Māori</nuxt-link>-->
  </header>
</template>
