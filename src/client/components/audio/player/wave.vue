<template>
	<div id="wave" class="my-3">
		<v-layout row wrap>
			<v-flex xs6>
				<v-btn outline icon @click.native="playing ? pause() : play()">
					<v-icon v-if="paused || !playing">play_arrow</v-icon>
					<v-icon v-else>pause</v-icon>
				</v-btn>
				<v-btn outline icon @click.native="stop()">
					<v-icon>stop</v-icon>
				</v-btn>
				<v-btn outline icon @click.native="mute()">
					<v-icon v-if="muted">volume_off</v-icon>
					<v-icon v-else>volume_up</v-icon>
				</v-btn>
				<!--<v-btn outline icon @click.native="download()">
					<v-icon>get_app</v-icon>
				</v-btn>-->
			</v-flex>
			<v-flex xs6>
				<v-slider v-model="volume" prepend-icon="volume_down" append-icon="volume_up" class="text-xs-right" />
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
	const distinctColors = require('distinct-colors');
	import WaveSurfer from 'wavesurfer.js';
	import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';

	export default {
		props: {
			file: String,
			placenames: Array,
		},
		data() {
			return {
				throttled: false,
				volume: 100,
				playing: false,
				paused: false,
				muted: false,
			};
		},
		watch: {
			file: function(file) {
				this.wavesurfer.load(file);
			},
			places: function() {
				//addRegions();
			},
			volume: function(volume) {
				this.wavesurfer.setVolume(volume / 100);
			},
		},
		mounted() {
			this.$nextTick(() => {
				this.wavesurfer = WaveSurfer.create({
					container: '#wave',
					responsive: true,
					//backend: 'MediaElement',
					//mediaControls: true,
					hideScrollbar: true,
					cursorWidth: 2,
					cursorColor: 'red',
					waveColor: 'darkorange',
					progressColor: 'peachpuff',
					//barWidth: 1,
					plugins: [RegionPlugin.create(this.regions)],
				});
				this.wavesurfer.on('audioprocess', () => {
					if (this.throttled) return;
					this.throttled = true;
					setTimeout(() => {
						this.throttled = false;
					}, 100);
					this.$emit('update:time', this.wavesurfer.getCurrentTime());
				});
				this.wavesurfer.on('seek', () => {
					this.$emit('update:time', this.wavesurfer.getCurrentTime());
				});
				this.wavesurfer.load(this.file);
				this.addRegions();
			});
		},
		computed: {
			names() {
				return this.placenames.map(placename => placename.names).flat().filter(names => names.spoken);
			},
			palette() {
				return distinctColors({count: this.names.length, lightMin: 70});
			},
			regions() {
				return this.names.map((name, index) => {
					return {
						id: name._id,
						start: name.spoken.start,
						end: name.spoken.end,
						attributes: {
							label: this.maoriName(name.name),
							//highlight: true,
						},
						color: this.palette[index].alpha(0.1).css(),
						drag: false,
						resize: false,
					};
				});
			},
		},
		methods: {
			stop() {
				this.paused = this.playing = false;
				this.wavesurfer.stop();
			},
			play() {
				if (this.playing) return;
				this.paused = false;
				this.wavesurfer.play();
				this.playing = true;
			},
			pause() {
				this.paused = !this.paused;
				this.paused ? this.wavesurfer.pause() : this.wavesurfer.play();
			},
			download() {
				//this.wavesurfer.pause()
				window.open(this.file, 'download');
			},
			mute() {
				this.wavesurfer.toggleMute();
				this.muted = this.wavesurfer.getMute();
			},
			randomColor(alpha) {
				return ('rgba(' +
					[
						~~(Math.random() * 255),
						~~(Math.random() * 255),
						~~(Math.random() * 255),
						alpha || 0.1,
					] + ')'
				);
			},
			addRegions() {
				this.wavesurfer.clearRegions();
				this.regions.forEach(region => {
					this.wavesurfer.addRegion(region);
				});
			},
		},
	};

</script>

<style scoped>
	audio {
		margin-top: 2em;
	}
	region.wavesurfer-region:before {
		content: attr(data-region-label);
		/*position: absolute;
		top: 0;*/
	}
</style>
