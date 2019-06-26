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
			start: function(start) {
				if (start) {
					this.cancelTimer();
					this.$refs.audio.currentTime = this.start;
					/*this.$timer = setTimeout(() => {
						this.$refs.audio.pause();
						//this.$refs.audio.currentTime = this.start;
					}, (this.stop - this.start) * 1000);*/
					this.$timer = setInterval(() => {
						if (this.$refs.audio.currentTime > this.stop) {
							this.$refs.audio.pause();
							//this.$refs.audio.currentTime = this.start;
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
			}
		}
	};
</script>

<style scoped>
	audio {
		width: 100%;
	}
</style>
