<template>
	<section class="elevation-2 pa-5 my-3" style="border-radius: 20px;">
		<h3 class="text-xs-center display-2" :title="current.phonetic"><nuxt-link :to="localePath({name: 'names-name', params: {name: current.code}})">{{current.name}}</nuxt-link></h3>
		<h3 class="text-xs-center display-1" v-if="common"><template v-if="current.common">({{current.common}})</template>&nbsp;</h3>
		<h4 class="text-xs-center headline" v-if="current.audio.speaker">{{$t('spoken') | initialcase}} <nuxt-link :to="localePath({name: 'speakers-speaker', params: {speaker: speakers[current.audio.speaker].code}})">{{speakers[current.audio.speaker].name}}</nuxt-link></h4>
		<waveplayer v-if="wave" :file="file" :places="places" v-on:time="currentTime = $event" />
		<htmlplayer v-else :file="file" v-on:time="currentTime = $event" />
		<h2>{{$tc('name', 2) | titlecase}}</h2>
		<ol start="0">
			<!--<li v-for="place in placelist" :key="place.code" :class="{active: place.code == current.code}"><a :href="'#' + place.code" v-html="place.name"></a></li>-->
			<li v-for="place in places" :key="place.code">
				<a v-for="(placename, index) in place.placenames.filter(placename => 'audio' in placename)" :key="placename.name" :href="'#' + place.code" :class="{active: placename.name == current.name}" :title="common && current.common ? current.common : ''">
					{{placename.name}}
					<template v-if="index != (place.placenames.filter(placename => 'audio' in placename).length - 1)">, </template>
				</a>
				<a v-if="place.placenames.filter(placename => 'audio' in placename).length === 0" :href="'#' + place.code"><del>{{place.name}}</del></a>
			</li>
		</ol>
	</section>
</template>

<script>
import htmlplayer from '~/components/audio_html.vue'
import waveplayer from '~/components/audio_wave.vue'

export default {
	components: {
		htmlplayer,
		waveplayer
  },
	props: {
		file: String,
		places: Array,
		speakers: Object,
		wave: {
			type: Boolean,
			value: false
		},
		common: {
			type: Boolean,
			value: false
		}
	},
  data () {
    return {
			currentTime: 0
    }
	},
	computed: {
		/*audio: function() {
			return this.places.map(place => place.placenames.filter(placename => 'audio' in placename));
		},*/
		current: function() {
			var current = {};
			for (var place in this.places) {
				for (var name in this.places[place].placenames) {
					if ('audio' in this.places[place].placenames[name]) {
						if (this.currentTime >= this.places[place].placenames[name].audio.prestart) {
							current = this.places[place].placenames[name];
							current.common = this.places[place].names.en;
							current.code = this.places[place].code;
						} else {
							return current;
						}
					}
				}
			}
			return current || {audio: {}};
		}
	},
	watch: {
		current: function(current) {
			location.replace("#" + current.code);
		}
	}
}
</script>

<style scoped>
ol {
	column-width: 12em;
	list-style-position: inside;
}
.active {
	font-weight: bold;
}
</style>
