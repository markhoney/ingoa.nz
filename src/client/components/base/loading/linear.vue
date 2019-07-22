<template>
	<v-progress-linear v-if="count" v-model="progress"></v-progress-linear>
</template>

<script>
	export default {
		data() {
			return {
				count: 0,
				maximum: 0,
			}
		},
		mounted() {
			this.$eventbus.$on('loading', (payload) => {
				this.count += payload;
				if (this.count > this.maximum) this.maximum = this.count;
				if (this.count == 0) this.maximum = 0;
			});
		},
		computed: {
			progress: function() {
				if (this.count) return (1 - (this.count / this.maximum)) * 100;
			},
		},
	};
</script>
