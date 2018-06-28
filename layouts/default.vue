<template>
	<v-app>
		<v-toolbar prominent extended> <!--  height="auto" -->
			<v-toolbar-title>
				<h1><a href="/">{{$t('title')}}</a></h1>
				<div class="subheading">{{$t('subtitle')}}</div>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items class="hidden-sm-and-down">
				<!--<v-menu open-on-hover top offset-y>
					<v-btn flat slot="activator" :to="localePath('islands')">{{$tc('location', 2) | titlecase}}</v-btn>
					<v-list>
						<v-list-tile v-for="island in islands" :key="island.code" :to="localePath({name: 'islands-island', params: {island: island.code}})">
							<v-list-tile-title>{{localeName(island.names)}}</v-list-tile-title>
						</v-list-tile>
					</v-list>
				</v-menu>
				<v-menu open-on-hover top offset-y>
					<v-btn flat slot="activator" :to="localePath('speakers')">{{$tc('speaker', 2) | titlecase}}</v-btn>
					<v-list>
						<v-list-tile v-for="speaker in speakers" :key="speaker.code" :to="localePath({name: 'speakers-speaker', params: {speaker: speaker.code}})">
							<v-list-tile-title>{{speaker.name}}</v-list-tile-title>
						</v-list-tile>
					</v-list>
				</v-menu>
				<v-menu open-on-hover top offset-y>
					<v-btn flat slot="activator" :to="localePath('kinds')">{{$tc('kind', 2) | titlecase}}</v-btn>
					<v-list>
						<v-list-tile v-for="island in islands" :key="island.code" :to="localePath({name: 'islands-island', params: {island: island.code}})">
							<v-list-tile-title>{{localeName(island.names)}}</v-list-tile-title>
						</v-list-tile>
					</v-list>
				</v-menu>-->
<!--				<v-btn flat :to="localePath('islands')">{{$tc('location', 2) | titlecase}}</v-btn>
				<v-btn flat :to="localePath('kinds')">{{$tc('kind', 2) | titlecase}}</v-btn>
				<v-btn flat :to="localePath('speakers')">{{$tc('speaker', 2) | titlecase}}</v-btn>-->
			</v-toolbar-items>
			<v-spacer></v-spacer>
			<nuxt-link v-for="locale in $i18n.locales" v-if="locale.code !== $i18n.locale" :key="locale.code" :to="switchLocalePath(locale.code)" class="mt-4 text-xs-center">
				<img :src="locale.image" /><br />
				{{locale.name}}
			</nuxt-link>
		</v-toolbar>
		<v-container>
	    <nuxt/>
		</v-container>
		<v-footer>
			<p class="text-xs-center" v-html="$t('copyright')"></p>
		</v-footer>
	</v-app>
</template>

<script>

export default {
  /*data () {
    return {
			islands: islands,
			speakers: speakers
    }
	}*/
}
</script>
