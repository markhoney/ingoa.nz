<template>
	<section>
		<p class="ma-3" style="font-style: italic;" v-html="$t('about')"/>
		<p class="ma-3" v-html="$t('intro')"/>
		<p class="ma-3" v-html="$t('instructions')"/>
		<islands />
		<v-alert :value="true" class="ma-3" type="info" icon="info">
			<span v-html="$t('disclaimer')" />
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
