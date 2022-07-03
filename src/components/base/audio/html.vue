<template>
	<audio ref="audio" class="my-3" controls @timeupdate="$emit('update:time', $event.target.currentTime)" @pause="cancelTimer()" @onseeking="cancelTimer()">
		<source :src="file" type="audio/mpeg" preload="auto">
	</audio>
</template>

<script>
	export default {
		props: {
			file: String,
			start: Number,
			stop: Number,
		},
		watch: {
			file: function() {
				this.$refs.audio.load();
			},
			start: function(start) {
				if (start) {
					this.cancelTimer();
					this.$refs.audio.currentTime = this.start;
					this.$timer = setInterval(() => {
						if (this.$refs.audio.currentTime > this.stop) {
							this.$refs.audio.pause();
							this.cancelTimer();
						}
					}, 100);
					this.$refs.audio.play();
				}
			},
		},
		methods: {
			cancelTimer: function() {
				clearTimeout(this.$timer);
			},
		},
	};
</script>

<style scoped>
	audio {
		width: 100%;
	}
</style>
