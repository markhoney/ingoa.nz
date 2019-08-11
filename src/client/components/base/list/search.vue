<template>
	<v-list three-line>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-title>
					<v-text-field label="Search" prepend-icon="search" solo v-model="search" />
				</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
		<template v-for="item in (search ? data.filter(item => item.title.text.toLowerCase().includes(search.toLowerCase())) : data)">
			<v-list-item v-if="item.title" :key="item._id">
				<v-list-item-content>
					<v-list-item-title>
						<nuxt-link v-if="item.title.link" :to="item.title.link">
							{{item.title.text}}
						</nuxt-link>
						<template v-else>
							{{item.title.text}}
						</template>
					</v-list-item-title>
					<v-list-item-subtitle v-if="item.subtitle && item.subtitle.text">
						<nuxt-link v-if="item.subtitle.link" :to="item.subtitle.link">
							{{item.subtitle.text}}
						</nuxt-link>
						<template v-else>
							{{item.subtitle.text}}
						</template>
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
			<v-divider :key="'d-' + item._id" />
		</template>
	</v-list>
</template>

<script>
	export default {
		props: {
			data: Array,
		},
		data() {
			return {
				search: "",
			};
		},
	};
</script>
