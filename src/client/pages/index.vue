<template>
	<section>
		<p class="ma-3" style="font-style: italic;" v-html="$t('aboutText')" />
		<p class="ma-3" v-html="$t('introText')" />
		<p class="ma-3" v-html="$t('instructionsText')" />
		<islands />
		<v-alert value class="ma-3" type="info" icon="info">
			<span v-html="$t('disclaimerText')" />
		</v-alert>
	</section>
</template>

<script>
import islands from '@/components/islands/cards.vue';

export default {
	components: {
		islands,
	},
	head() {
		return {
			title: 'Home',
		};
	},
};
</script>
