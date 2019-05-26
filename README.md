# **Ngā Ingoa o Aotearoa:** An oral dictionary of Māori placenames

Ngā Ingoa o Aotearoa is an audio dictionary of New Zealand place names, spoken by native speakers of Māori who were chosen by each other as the best speakers for their respective geographical areas.

The dataset for this dictionary details names, places, locations, groups, features, speakers, maps, iwi and other information about the place names that have been spoken and recorded.

## Technology

This project uses the [Nuxt.js](https://nuxtjs.org/) framework and [Apollo GraphQL](https://www.apollographql.com/) to host the database of spoken placenames. These services are run separately, although there is a (currently broken) script to run GraphQL as Nuxt middleware, and another script to run both GraphQL and Nuxt as middleware in [Express](https://expressjs.com/). Data is stored either as plain JavaScript object or in [NeDB](https://github.com/louischatriot/nedb) collections.

GraphQL is always run on port 4000, whereas Nuxt is run on port 8000 in development and port 3000 in production. This port separation is used to make debugging of the development and production modes easier, as there are no concerns that cached development files in the browser (service workers, GraphQL data, etc) will pollute the production environment during testing, or vice versa.

The site can be run in development (`yarn dev`) or production modes, with production options for both dynamically generated (`yarn prod`) and statically genrated (`yarn static`) sites. [Docker](https://www.docker.com/) container creation is supported for both the dynamic (`yarn docker:dynamic`) and static (`yarn docker:static`) production sites, using [Caddy](https://caddyserver.com/) as a proxy for the Nuxt and Apollo services.

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
      - **json** - _Plain JSON objects_
      - **nedb** - _DB collection files_
    - **rest** - _Scripts for running a REST API_

## Data

All data for this project was collated by Hugh Young and originally made available in a series of three audio recordings with accompanying booklets.

The audio recordings have been digitised as MP3, with Audacity's noise reduction filter run on them to reduce background noise.

Geographical location data for some of the places has been gleaned from the LINZ New Zealand [Gazetteer of place names](https://www.linz.govt.nz/regulatory/place-names/find-place-name/new-zealand-gazetteer-place-names).

## Commands

This list of commands is not exhaustive, but rather is a listing of the main commands that are useful for this project. See the package.json file in the root of this repository for a full list of commands. All commands are run using [Yarn](https://yarnpkg.com), as this is the recommended package manager (rather than NPM) for Nuxt.

`yarn install` - Download both production and development NPM packages for this project. This must be run before any other yarn commands.

`yarn prepare:import` - Import data from TSV files (in `src/data/source`) into JSON files. Output files are saved to `src/server/db/json`.

`yarn prepare:nedb` - Import data from TSV files into NeDB database collections. The DB files are saved to `src/server/db/nedb`.

`yarn prepare:connect` - Make data connections between the NeDB collections.

`yarn prepare:images` - Download satellite images from google maps - for Islands, Regions, Zones, etc. These files are saved to subfolders in `src/client/static/img`.

`yarn prepare:apollo` - Upload apollo schema to allow Apollo Engine analysis

`yarn dev` - Run Apollo and Nuxt in development mode (Apollo Playground will be available at [http://localhost:4000/graphql](http://localhost:4000/graphql), Apollo tracing will be enabled, Nuxt link prefetching will be disabled and [Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) can be used)

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
