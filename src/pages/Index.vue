<template>
	<article>
		<h1>{{$t('title')}}</h1>
		<h2>{{$t('subtitle')}}</h2>
		<p class="m-3" style="font-style: italic;" v-html="$t('aboutText')" />
		<p class="m-3" v-html="$t('introText')" />
		<p class="m-3" v-html="$t('instructionsText')" />
		<b-alert show variant="warning" v-html="$t('disclaimerText')">
		</b-alert>
	</article>
</template>
