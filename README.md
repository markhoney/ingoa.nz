# Ngā Ingoa o Aotearoa: An oral dictionary of Māori placenames

This project uses the [Nuxt.js](https://nuxtjs.org/) framework and [Apollo GraphQL](https://www.apollographql.com/) to host the Ingoa database of spoken Māori placenames. These services are run separately, although there is a (currently broken) script to run GraphQL as Nuxt middleware, and another script to run both GraphQL and Nuxt as middleware in Express.

GraphQL is always run on port 4000, whereas Nuxt is run on port 8000 in development and port 3000 in production. This port separation is to make debugging of the development and production modes easier, as there are no concerns that development data (service workers, cached data, etc) will pollute the production environment during testing, and vice versa.

The site can be run in development (`yarn dev`) or production, with production options for both dynamically generated (`yarn prod`) and statically genrated (`yarn static`) sites. Docker container creation is supported for both the dynamic (`yarn docker:dynamic`) and static (`yarn docker:static`) production sites, using [Caddy](https://caddyserver.com/) as a proxy for the Nuxt and Apollo services.

## Commands

This list of commands is not exhaustive, but rather is a listing of the main commands that are useful for this project. See the package.json file in the root of this repository for a full list of commands. All commands are run using [Yarn](https://yarnpkg.com), as this is the recommended package manager (rather than NPM) for Nuxt.

`yarn install` - Download both production and development NPM packages for this project. This must be run before any other yarn commands.

`yarn prepare:import` - Import data from TSV files into JSON files

`yarn prepare:nedb` - Import data from TSV files into NeDB database collections

`yarn prepare:connect` - Make connections between NeDB collections

`yarn prepare:images` - Download satellite images from google maps for Islands, Regions, Zones, etc

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
