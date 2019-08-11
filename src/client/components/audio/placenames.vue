<template>
	<section class="elevation-4 pa-5 my-3" v-if="current">
		<h3 :title="current.title.phonetic" class="text-xs-center display-2">
			<nuxt-link :to="localePath({name: 'placename-zone-placename', params: {zone: localeCurrent((current.placename.zone || current.placename.part || current.placename.island).slug), placename: localeCurrent(current.placename.slug)}})">
				{{current.title.locale | maori}}
			</nuxt-link>
		</h3>
		<h4 class="text-xs-center display-1">
			<template v-if="current.title.locale.en">({{current.title.locale | english}})</template><template v-else>&nbsp;</template>
		</h4>
		<h3 v-if="common" class="text-xs-center display-1">
			<span v-if="current.common">({{current.common}})</span>&nbsp;
		</h3>
		<h4 v-if="current.spoken.speaker" class="text-xs-center headline">
			{{$t('spoken') | initialcase}}
			<nuxt-link :to="localePath({name: 'speaker-speaker', params: {speaker: localeCurrent(current.spoken.speaker.slug)}})">
				{{current.spoken.speaker.title.locale | locale(this.locale())}}
			</nuxt-link>
		</h4>
		<!--<player :file="file" :time.sync="currentTime" :placenames="placenames" />-->
		<player ref="audio" :file="file" :time.sync="currentTime" :start="start" :stop="stop" />
		<h2>{{$tc('name', 2) | titlecase}}</h2>
		<ol start="0">
			<!--<li v-for="place in placelist" :key="place._id" :class="{active: place._id == current._id}"><a :href="'#' + place._id" v-html="place.title.locale"></a></li>-->
			<li v-if="placenames.length && placenames[0].names[0].title.locale.mi == 'Intro'">{{placenames[0].names[0].title.locale.mi}}</li>
			<li v-for="placename in placenames.filter(placename => placename.names[0].title.locale.mi != 'Intro')" :key="placename._id" v-ripple="{class: 'success--text'}">
				<!--<nuxt-link
					v-for="(name, index) in placename.names.filter(name => 'spoken' in name)"
					:key="name.title.ascii"
					:to="localePath({name: 'zone-zone-placename', params: {zone: localeCurrent(placename.zone.slug), placename: localeCurrent(placename.slug)}})"
					:class="{active: name.title.locale == current.title.locale}"
					:title="common && current.common ? current.common : ''"
				>-->
				<span v-for="(name, index) in placename.names.filter(name => name.spoken)" :class="['name', {active: name._id == current._id}]" :key="name._id" @click="jump(name.spoken.start, name.spoken.end)">
					{{name.title.locale.mi}}<template v-if="index != (placename.names.filter(name => name.spoken).length - 1)">,</template>
				</span>
				<!--</nuxt-link>-->
				<!--<nuxt-link v-if="placename.names.filter(name => 'spoken' in name).length === 0" :to="localePath({name: 'zone-zone-placename', params: {zone: localeCurrent(placename.zone.slug), placename: localeCurrent(placename.slug)}})">-->
				<!--<span v-if="placename.names.filter(name => 'spoken' in name).length === 0">
					<del>{{placename.names[0].mi}}</del>
				</span>-->
				<!--</nuxt-link>-->
			</li>
		</ol>
	</section>
</template>

<script>
	import player from '@/components/base/audio/html.vue';
	//import player from '@/components/base/audio/wave.vue';

	export default {
		components: {
			player,
		},
		props: {
			file: String,
			field: String,
			value: String,
			data: Array,
			/*wave: {
				type: Boolean,
				value: false,
			},*/
			common: {
				type: Boolean,
				value: false,
			},
		},
		data() {
			return {
				currentTime: 0,
				playing: 0,
				start: 0,
				stop: 0,
			};
		},
		apollo: {
			remote: {
				skip() {
					return (this.data ? true : false);
				},
				query() {
					return this.$gql`query placenames($field: String, $value: String) {
						placenames(filter: [{field: $field, value: $value}]) {
							_id
							slug {
								en
								mi
							}
							zone {
								slug {
									en
									mi
								}
							}
							part {
								slug {
									en
									mi
								}
							}
							island {
								slug {
									en
									mi
								}
							}
							names {
								_id
								title {
									locale {
										mi
										en
									}
									alt {
										ascii
									}
								}
								spoken {
									pre
									post
									start
									end
									speaker {
										_id
										slug {
											en
											mi
										}
										title {
											locale {
												en
												mi
											}
										}
									}
								}
							}
							places {
								_id
								title {
									locale {
										en
										mi
									}
								}
							}
						}
					}`;
				},
				update: response => response.placenames,
				variables() {
					return { 
						field: this.field,
						value: this.value,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		computed: {
			placenames: function() {
				return this.data || this.remote;
			},
			bookmarks: function() {
				if (this.placenames) return this.placenames.map(placename => placename.names.map(name => {
					return {
						...name,
						placename: placename,
					};
				})).flat().filter(name => name.spoken).sort((a, b) => a.spoken.start - b.spoken.start);
				//if (this.placenames) return this.placenames.map(placename => placename.names.filter(name => name.spoken)).flat().sort((a, b) => a.spoken.start - b.spoken.start);
				return [];
			},
			current: function() {
				return this.bookmarks.find(bookmark => bookmark.spoken.post >= this.currentTime);
			},
		},
		methods: {
			jump: function(start, stop) {
				this.stop = stop + 0.1;
				this.$nextTick(() => {
					this.start = 0;
					this.$nextTick(() => {
						this.start = start;
					});
				});
			},
		},
	};
</script>

<style scoped>
	section {
		background-color: #f1f3f4;
		border-radius: 20px;
	}
	ol {
		column-width: 12em;
		list-style-position: inside;
	}
	.name {
		cursor: pointer;
	}
	.active {
		font-weight: bold;
	}
</style>
