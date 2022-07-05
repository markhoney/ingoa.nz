<template>
		<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark w-100">
			<div class="d-flex w-100 justify-content-between">
				<g-link class="navbar-brand" :to="$tp('/')">{{$t('title')}}</g-link>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarCollapse">
					<ul class="navbar-nav mb-2 mb-md-0">
						<li class="nav-item"><g-link class="nav-link" :to="$tp('/')">{{$case.sentenceCase($t('home'))}}</g-link></li>
						<li v-for="type in types" :key="type" class="nav-item">
							<g-link class="nav-link" :to="$tp(`/${$tc('type.' + type, 2)}/`)">
								{{$case.sentenceCase($tc('type.' + type, 2))}}
							</g-link>
						</li>
					</ul>
				</div>
				<search class="m-2" />
			</div>
		</nav>
</template>

<script>
	import Search from './search/Search.vue';
	// import Dark from './Dark.vue';
	export default {
		// components: {Search, Dark},
		components: {Search},
		data() {
			return {
				types: ['island', 'part', 'map', 'region', 'sector', 'district', 'zone', 'group', 'feature', 'iwi', 'placename', 'speaker'],
			};
		},
	};
</script>
