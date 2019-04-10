<template>
	<span>
		<v-icon v-if="playing" color="orange darken-2" @click="$refs.audio.pause(); playing = false">
			pause
		</v-icon>
		<v-icon v-else color="green darken-2" @click="$refs.audio.play(); playing = true">
			play_arrow
		</v-icon>
		<audio ref="audio" @timeupdate="currentTime = $event.target.currentTime">
			<!-- :currentTime.prop="currentTime" -->
			<source :src="file" type="audio/mpeg" preload="auto">
		</audio>
	</span>
</template>

<script>
	export default {
		props: {
			file: String,
			start: Number,
			end: Number,
		},
		data() {
			return {
				currentTime: 0,
				playing: false,
			};
		},
		watch: {
			currentTime: function(current) {
				if (current > this.end) {
					this.$refs.audio.currentTime = this.currentTime = this.start;
					this.playing = false;
					this.$refs.audio.pause();
				}
			},
		},
		mounted() {
			this.$refs.audio.currentTime = this.currentTime = this.start;
		},
	};
</script>
