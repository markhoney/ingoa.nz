<template>
	<div>
		<h3 class="text-xs-center display-2">{{current.name}}<span v-if="current.phonetic"> ({{current.phonetic}})</span></h3>
		<h4 class="text-xs-center headline" v-if="current.audio.speaker">{{$t('spoken') | initialcase}} {{current.audio.speaker}}</h4>
		<audio controls ref="audio" @timeupdate='currentTime = $event.target.currentTime'>
			<source :src="file" type="audio/mpeg" preload="auto" />
		</audio>
		<h2>{{$tc('name', 2) | titlecase}}</h2>
		<ol start="0">
			<li v-for="place in placelist" v-bind:key="place.code"><a :href="'#' + place.code">{{place.name}}</a></li>
		</ol>
	</div>
</template>

<style scoped>
audio {
  width: 100%;
	margin: 20px;
}
</style>

<script>
export default {
  data () {
    return {
			setTime: 0,
			currentTime: 0
    }
	},
	props: {
		file: String,
		places: Object
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
			return currentbookmark || {audio: {}};
		}
	},
	watch: {
		current: function(current) {
			location.replace("#" + current.code);
		}
	}
}
</script>
