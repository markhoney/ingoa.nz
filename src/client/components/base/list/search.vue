<template>
	<v-list three-line>
		<v-list-tile>
			<v-list-tile-content>
				<v-list-tile-title>
					<v-text-field label="Search" prepend-icon="search" solo v-model="search" />
				</v-list-tile-title>
			</v-list-tile-content>
		</v-list-tile>
		<template v-for="item in (search ? items.filter(item => localeCurrent(item.title.text).toLowerCase().includes(search.toLowerCase())) : items)">
			<v-list-tile :key="item._id">
				<v-list-tile-content>
					<v-list-tile-title>
						<nuxt-link v-if="item.title.link" :to="item.title.link">
							{{item.title.text}}
						</nuxt-link>
						<template v-else>
							{{item.title.text}}
						</template>
					</v-list-tile-title>
					<v-list-tile-sub-title v-if="item.subtitle.text">
						<nuxt-link v-if="item.subtitle.link" :to="item.subtitle.link">
							{{item.subtitle.text}}
						</nuxt-link>
						<template v-else>
							{{item.subtitle.text}}
						</template>
					</v-list-tile-sub-title>
				</v-list-tile-content>
			</v-list-tile>
			<v-divider :key="'d-' + item._id" />
		</template>
	</v-list>
</template>

<script>
	export default {
		props: {
			items: Array,
		},
		data() {
			return {
				search: "",
			}
		},
	}
</script>
