<template>
	<div>
		<h3>{{current.name}}</h3>
		<h4 v-if="current.audio.speaker">Spoken by {{current.audio.speaker}}</h4>
		<button @click="wavesurfer.playPause()">Play/Pause</button>
		<div id="wave" ref="wave" @audioprocess="currentTime = $event.target.getCurrentTime()" />
		<h2>Place Names</h2>
		<ol start="0">
			<li v-for="place in placelist" v-bind:key="place.code"><a :href="'#' + place.code">{{place.name}}</a></li>
		</ol>
	</div>
</template>

<style scoped>
</style>

<script>
export default {
  data () {
    return {
			setTime: 0,
			currentTime: 0,
			bookmark: {}
    }
	},
	props: {
		file: String,
		places: Array
	},
	computed: {
    placelist: function () {
			var output = [];
			for (var place in this.places) {
				var names = [];
				for (var name in this.places[place].names) {
					if (this.places[place].names[name].audio) {
						names.push(name);
					}
				}
				output.push({name: names.join(" / "), code: this.places[place].code});
			}
			return output;
    },
    bookmarks: function () {
			var zonebookmarks = [];
			for (var place in this.places) {
				for (var name in this.places[place].names) {
					if (this.places[place].names[name].audio) {
						this.places[place].names[name].name = name;
						this.places[place].names[name].code = this.places[place].code;
						zonebookmarks.push(this.places[place].names[name]);
					}
				}
			}
			return zonebookmarks;
		},
    current: function () {
			var currentbookmark = {};
			for (var bookmark in this.bookmarks) {
				if (this.currentTime >= this.bookmarks[bookmark].audio.prestart) {
					currentbookmark = this.bookmarks[bookmark];
				} else {
					return currentbookmark;
				}
			}
			return currentbookmark;
		}
	},
  mounted () {
		this.$nextTick(() => {
			this.wavesurfer = WaveSurfer.create({
				container: '#wave',
				responsive: true,
				plugins: [
					WaveSurfer.regions.create()
				]
			});
			console.log(this.wavesurfer.params.container);
			//this.wavesurfer.params.container.querySelector('audio').controls = true;
			//this.$refs["wave"].container.querySelector('audio').controls = true;
			this.wavesurfer.load(this.file);
			this.wavesurfer.on('audioprocess', () => {this.currentTime = this.wavesurfer.getCurrentTime()});
			this.wavesurfer.on('seek', () => {this.currentTime = this.wavesurfer.getCurrentTime()});
			addRegions(this);
			/*for (var bookmark in this.bookmarks) {
				this.wavesurfer.addRegion({
					id: this.bookmarks[bookmark].audio.code,
					start: this.bookmarks[bookmark].audio.start,
					end: this.bookmarks[bookmark].audio.end,
					attributes: {
						label: this.bookmarks[bookmark].audio.name
					},
					drag: false,
					resize: false,
				});
			}*/
		});
  },
	watch: {
		current: function(current) {
			location.replace("#" + current.code);
		},
		file: function(newfile) {
			this.wavesurfer.load(newfile);
		},
		bookmarks: function() {
			addRegions(this);
			/*this.wavesurfer.clearRegions();
			for (var bookmark in bookmarks) {
				this.wavesurfer.addRegion({
					id: bookmarks[bookmark].audio.code,
					start: bookmarks[bookmark].audio.start,
					end: bookmarks[bookmark].audio.end,
					attributes: {
						label: bookmarks[bookmark].audio.name
					},
					drag: false,
					resize: false,
				});
			}*/
		}
	},
	head: {
    script: [
			{src: 'https://unpkg.com/wavesurfer.js/dist/wavesurfer.min.js'},
			{src: 'https://unpkg.com/wavesurfer.js/dist/plugin/wavesurfer.regions.min.js'}
		],
	}
}

function addRegions(vm) {
	vm.wavesurfer.clearRegions();
	for (var bookmark in vm.bookmarks) {
		vm.wavesurfer.addRegion({
			id: vm.bookmarks[bookmark].audio.code,
			start: vm.bookmarks[bookmark].audio.start,
			end: vm.bookmarks[bookmark].audio.end,
			attributes: {
				label: vm.bookmarks[bookmark].name,
				highlight: true
			},
			color: randomColor(),
			drag: false,
			resize: false,
		});
	}
}
function randomColor(alpha) {
	return (
		'rgba(' +
		[
			~~(Math.random() * 255),
			~~(Math.random() * 255),
			~~(Math.random() * 255),
			alpha || 0.1
		] +
		')'
	);
}
</script>

<style scoped>
region.wavesurfer-region:before {
    content: attr(data-region-label);
    position: absolute;
    top: 0;
}
</style>
