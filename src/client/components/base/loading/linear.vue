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
		computed: {
			loading: function() {
				return this.$store.state.loading;
			},
			progress: function() {
				if (this.loading) return (1 - (this.loading / this.maximum)) * 100;
			},
		},
		watch: {
			loading: function() {
				if (this.loading > this.maximum) this.maximum = this.loading;
				if (this.loading == 0) this.maximum = 0;
			}
		}
	};
</script>
