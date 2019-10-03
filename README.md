# **Ngā Ingoa o Aotearoa:** An oral dictionary of Māori placenames

Ngā Ingoa o Aotearoa is an audio dictionary of New Zealand place names, spoken by native speakers of Māori who were chosen by each other as the best speakers for their respective geographical areas.

The dataset for this dictionary details names, places, locations, groups, features, speakers, maps, iwi and other information about the place names that have been spoken and recorded.

## Source Data

All data for this project was collated by Hugh Young and originally made available in a series of three audio recordings with accompanying booklets.

The audio recordings have been digitised as MP3, with Audacity's noise reduction filter run on them to reduce background noise.

Geographical location data for some of the places has been gleaned from the LINZ New Zealand [Gazetteer of place names](https://www.linz.govt.nz/regulatory/place-names/find-place-name/new-zealand-gazetteer-place-names).

## Technology

This project uses the [Nuxt.js](https://nuxtjs.org/) framework and [Apollo GraphQL](https://www.apollographql.com/) to host the database of spoken placenames. These services are run separately, although there is a (currently broken) script to run GraphQL as Nuxt middleware, and another script to run both GraphQL and Nuxt as middleware in [Express](https://expressjs.com/). Data is stored as plain JavaScript objects, and loaded into memory before Apollo is run.

GraphQL is always run on port 4000, whereas Nuxt is run on port 8000 in development and port 3000 in production. This port separation is used to make debugging of the development and production modes easier, as there are no concerns that cached development files in the browser (service workers, GraphQL data, etc) will pollute the production environment during testing, or vice versa.

## Import

### import.js

Import of the data from a set of TSV files is done via the JavaScript file `src/data/import.js`. The TSV files are exported from a [Google Spreadsheet](https://docs.google.com/spreadsheets/d/10vHNjsZS4medQMkfvldhYx8-WE3ICVEkwLi6wq5eNdU) and placed into `src/data/source`. From there, the script uses Node Streams to save processed data to `src/server/db/json`.

### connect.js

Once the data has been imported into a set of JSON files, a second script - `src/data/connect.js` is run to make connections between different parts of the data set, and pull in external data. None of these connections link base tables together, so as to avoid circular structures and doubling up of data. Once the data has been updated, it's saved back to the same set of JSON files.

This script has dependencies, such as [Wikipedia](https://www.wikipedia.org), [WikiData](https://www.wikidata.org/), [Nominatim](https://nominatim.openstreetmap.org/) and [Maori Maps](https://maorimaps.com/), and caches files as it goes to avoid spamming these services.

#### Nominatim

Connect.js depends on the Nominatim service, and by default, to avoid API limits, uses a local dockerised copy of Nominatim. The Nominatim container is defined in `src/serve/docker-nominatim.yml`. To get the container up and running, it needs the local ANZ dataset to be downloaded and imported into PostgreSQL. To do this, run:

```bash
cd /tmp
wget https://download.geofabrik.de/australia-oceania/new-zealand-latest.osm.pbf

docker run -t --name nominatim -v /tmp:/src -v nominatim:/data/postgresdata mediagis/nominatim sh /app/init.sh /src/new-zealand-latest.osm.pbf postgresdata 4

docker run --restart=always -p 6432:6432 -p 8080:8080 -d --name nominatim -v nominatim:/var/lib/postgresql/11/main mediagis/nominatim bash /app/start.sh

docker exec nominatim chown postgres:postgres /var/lib/postgresql/11/main
docker exec nominatim chmod 0750 /var/lib/postgresql/11/main

docker restart nominatim
```

### memory.js

A final data editing step is run whenever GraphQL is launched, and this step connects data types together. This step is done in memory only, and is not saved back to the JSON files, to avoid duplication and circular dependency issues.

### GraphQL

The GraphQL script `src/server/apollo/index.js` first loads the source data into memory with the script `src/server/db/memory.js`. Then it launches the Apollo GraphQL server on port 4000.

### Nuxt

Nuxt is used with i18n (Internationalisation) support, allowing the site to be offered in both English and Māori.

The Apollo client handles caching of frontend data, and GraphQL data is used for each page to dynamically register locale URLs.

#### Loading indicator

Apollo's `watchLoading` method is used wherever data is requested from GraphQL to increment and decrement a loading variable in VueX:

```javascript
watchLoading (isLoading, countModifier) {
  this.$store.commit('loading', countModifier);
},
```

This is used to display a loading overlay in the frontend:

```html
<template>
	<v-dialog v-model="dialog" fullscreen transition="">
		<v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
			<v-layout justify-center align-center>
				<v-progress-circular indeterminate color="primary" />
			</v-layout>
		</v-container>
	</v-dialog>
</template>

<script>
	export default {
		computed: {
			loading: function() {
				return this.$store.state.loading;
			},
			dialog: function() {
				return (this.loading > 0 ? true : false);
			},
		},
	};
</script>
```

#### Dynamic component data

A base set of re-usable components have been made in `src/client/components/base`, and these are used by the components in `src/client/components` to display tiles containing data. Data components have been created to allow them to be used either with a GraphQL query property, in which case the component will fetch the data itself, or with a data property, which will pass the data to the component. This allows for a flexible approach, where a component can be fed the data it needs if the parent component already has the data, or retrieve the data if the parent does not have the required data. This approach allows the frontend to minimise the number of GraphQL database calls.

The components use Apollo's skip method to skip the data query if the data prop of the component has been filled:

```javascript
skip() {
  return (this.data ? true : false);
},
```

If no data prop has been supplied, the component uses the `field` and `value` props to query GraphQL:

```javascript
variables() {
  return {
    field: this.field,
    value: this.value,
  };
},
```

### Monitoring

Metrics are provided when Nuxt is running in development mode via AppMetrics.

## Launching

The site can be run in development (`yarn dev`) or production modes, with production options for both dynamically generated (`yarn prod`) and statically generated (`yarn static`) sites. [Docker](https://www.docker.com/) container creation is supported for both the dynamic (`yarn docker:dynamic`) and static (`yarn docker:static`) production sites, using [Caddy](https://caddyserver.com/) as a proxy for the Nuxt and Apollo services.

## Directory Structure

The most important folders used by this project are:

- **dist** - _Static files generated by Nuxt_
- **src** - _All source code and data_
  - **client** - _Nuxt files_
    - **assets** - _Images, etc for the site_
    - **components** - _Vue components - for maps, audio, etc_
    - **layouts** - _Base webpage templates_
    - **locales** - _Language files_
    - **pages** - _Site pages_
    - **plugins** - _Plugins for google maps, Vue mixins and filters, Apollo client, etc_
    - **static** - _Static website files (usually files that are referenced dynamically, which means that Webpack can't process them properly)_
      - **audio** - _MP3 audio files for spoken place names_
      - **img** - _Header and map images_
    - **store** - _VueX store_
  - **data** - _All source data. Includes scripts to import and process the site's data_
    - **source** - _Source Tab Separated Value (TSV) files, taken from a [google spreadsheet](https://docs.google.com/spreadsheets/d/10vHNjsZS4medQMkfvldhYx8-WE3ICVEkwLi6wq5eNdU) _
  - **server** - _All files needed to run the API services - both REST API and GraphQL_
    - **apollo** - _GraphQL server files (schema, resolvers, etc)_
    - **db** - _Processed data files_
      - **json** - _DB collection files_
    - **rest** - _Scripts for running a REST API_

## Commands

This list of commands is not exhaustive, but rather is a listing of the main commands that are useful for this project. See the package.json file in the root of this repository for a full list of commands. All commands are run using [Yarn](https://yarnpkg.com), as this is the recommended package manager (rather than NPM) for Nuxt.

`yarn install` - Download both production and development NPM packages for this project. This must be run before any other yarn commands.

`yarn prep:data:import` - Import data from TSV files (in `src/data/source`) into JSON files. Output files are saved to `src/server/db/json`.

`yarn prep:data:connect` - Make data connections between the NeDB collections.

`yarn prep:images` - Download satellite images from google maps - for Islands, Regions, Zones, etc. These files are saved to subfolders in `src/client/assets/img`.

`yarn prep:audio` - Split the zone based audio files into separate MP3s for each spoken word. These files are saved to subfolders in `src/client/static/audio`

`yarn prep:apollo` - Upload apollo schema to allow Apollo Engine analysis

`yarn dev:apollo` - Run Apollo in development mode (Apollo Playground will be available at [http://localhost:4000/graphql](http://localhost:4000/graphql), Apollo tracing will be enabled, and metrics will be available at [http://localhost:4000/metrics/](http://localhost:4000/metrics/)).

`yarn dev:nuxt` - Run Nuxt in development mode (Nuxt link prefetching will be disabled, [Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) can be used, and metrics will be available at [http://localhost:3000/metrics/](http://localhost:3000/metrics/))

`yarn dev` - Run Apollo and Nuxt in development mode, waiting for Apollo to be available before launching Nuxt.

`yarn dev:share` - Share the development environment over the internet as [http://ingoa.localtunnel.me](http://ingoa.localtunnel.me)

`yarn prod` - Build and serve the dynamic Nuxt site, and also run Apollo

`yarn static` - Generate a set of static HTML files and host them locally using Caddy

`yarn docker:dynamic` - Create a Docker image with the Apollo server and all the files needed to run the dynamic production version of Nuxt. PM2 is used to run Apollo, Nuxt and Caddy.

`yarn docker:static` - Create a Docker image with generated static Nuxt files. Caddy is used to serve these static files.

## To Do

- ~~Always request IDs~~
- ~~Generate Bookmarks~~
- ~~Round coords~~
- ~~Add island, part and zone IDs to audio component - make dynamic GQL request~~
