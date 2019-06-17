<template>
	<section class="elevation-4 pa-5 my-3" style="background-color: #f1f3f4; border-radius: 20px;" v-if="current">
		<h3 :title="current.name.phonetic" class="text-xs-center display-2">
			<!--<nuxt-link :to="localePath({name: 'placename-zone-placename', params: {zone: current.zone_id, placename: current.code}})">-->
				{{current.name | maori}}
			<!--</nuxt-link>-->
		</h3>
		<h4 class="text-xs-center display-1">
			<template v-if="current.name.en">({{current.name | english}})</template><template v-else>&nbsp;</template>
		</h4>
		<h3 v-if="common" class="text-xs-center display-1">
			<span v-if="current.common">({{current.common}})</span>&nbsp;
		</h3>
		<h4 v-if="current.spoken.speaker" class="text-xs-center headline">
			{{$t('spoken') | initialcase}}
			<nuxt-link :to="localePath({name: 'speaker-speaker', params: {speaker: current.spoken.speaker.code}})">
				{{current.spoken.speaker.name | locale($i18n.locale)}}
			</nuxt-link>
		</h4>
		<waveplayer v-if="wave" :file="file" :time.sync="currentTime" :placenames="placenames" />
		<htmlplayer v-else      :file="file" :time.sync="currentTime" />
		<h2>{{$tc('name', 2) | titlecase}}</h2>
		<ol start="0">
			<!--<li v-for="place in placelist" :key="place.code" :class="{active: place.code == current.code}"><a :href="'#' + place.code" v-html="place.name"></a></li>-->
			<li v-if="placenames.length && placenames[0].names[0].en == 'Intro'">{{placenames[0].names[0].en}}</li>
			<li v-for="placename in placenames.filter(placename => placename.names[0].en != 'Intro')" :key="placename.code">
				<!--<nuxt-link
					v-for="(name, index) in placename.names.filter(name => 'spoken' in name)"
					:key="name.name.ascii"
					:to="localePath({name: 'zone-zone-placename', params: {zone: placename.zone.code, placename: placename.code}})"
					:class="{active: name.name == current.name}"
					:title="common && current.common ? current.common : ''"
				>-->
				<span v-for="(name, index) in placename.names.filter(name => 'spoken' in name)" :class="{active: name._id == current._id}" :key="name._id" @click="jump(name.spoken.start)">
					{{name.name.mi}}<template v-if="index != (placename.names.filter(name => 'spoken' in name).length - 1)">,</template>
				</span>
				<!--</nuxt-link>-->
				<!--<nuxt-link v-if="placename.names.filter(name => 'spoken' in name).length === 0" :to="localePath({name: 'zone-zone-placename', params: {zone: placename.zone.code, placename: placename.code}})">-->
				<!--<span v-if="placename.names.filter(name => 'spoken' in name).length === 0">
					<del>{{placename.names[0].mi}}</del>
				</span>-->
				<!--</nuxt-link>-->
			</li>
		</ol>
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import htmlplayer from '@/components/audio/player/html.vue';
	import waveplayer from '@/components/audio/player/wave.vue';

	export default {
		components: {
			htmlplayer,
			waveplayer,
		},
		props: {
			file: String,
			field: String,
			value: String,
			wave: {
				type: Boolean,
				value: false,
			},
			common: {
				type: Boolean,
				value: false,
			},
		},
		data() {
			return {
				currentTime: 0,
			};
		},
		apollo: {
			placenames: {
				query: gql`query placenames($field: String, $value: String) {
					placenames(filter: {field: $field, value: $value}) {
						_id
						code
						zone_id
						names {
							_id
							name {
								mi
								en
								ascii
							}
							spoken {
								pre
								post
								start
								end
								speaker {
									_id
									code
									name {
										en
										mi
									}
								}
							}
						}
						places {
							_id
							name {
								en
								mi
							}
						}
					}
				}`,
				variables() {
					return {
						field: this.field,
						value: this.value,
					}
				},
			},
		},
		computed: {
			bookmarks: function() {
				if (this.placenames) return this.placenames.map(placename => placename.names).flat().filter(name => name.spoken).sort((a, b) => a.spoken.start - b.spoken.start);
				return [];
			},
			current: function() {
				return this.bookmarks.find(bookmark => bookmark.spoken.post >= this.currentTime);
			},
		},
		methods: {
			jump: function(time) {

			},
		},
	};
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
