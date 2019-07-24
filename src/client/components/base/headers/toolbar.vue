<template>
	<v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" flat prominent app fixed dark height="100">
		<!-- <div style="background: url('/img/header.jpg') center left no-repeat; position: absolute; left: 0; top: 0; width: 100vw; height: 200px;"></div> -->
		<!--<v-parallax src="/img/header.jpg" style="width: 100%; margin: 0; padding: 0; filter: grayscale(50%); height: 100px;">
		<section style="background: url('/img/foreground.png') bottom left no-repeat; height: 100%; margin: 0; filter: grayscale(0%);">-->
		<v-toolbar-side-icon @click.stop="$store.commit('drawerToggle');" role="menu" />
		<v-toolbar-title><!-- style="margin-top: 280px; margin-left: 65px;" -->
			<h1>
				<nuxt-link :to="localePath('index')" style="text-transform: uppercase; font-weight: bold; color: #ffffff;">
					{{$t('title')}}
				</nuxt-link>
			</h1><!-- class="grey--text text--darken-4" -->
			<div class="subheading">
				{{$t('subtitle')}}
			</div>
		</v-toolbar-title>
		<v-spacer />
		<mainmenu />
		<v-spacer />
		<languages />
		<!--</section>
		</v-parallax>-->
	</v-toolbar>
</template>

<script>
	import mainmenu from '@/components/menu/main.vue';
	import languages from '@/components/base/headers/languageshover.vue';

	export default {
		components: {
			mainmenu,
			languages,
		},
	};
</script>
