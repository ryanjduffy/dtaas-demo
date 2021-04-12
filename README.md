# City Operations Demo App

A demo application to illustrate the possible use case of a city operations department managing the resolution of road hazards that were identified by connected vehicles.

## Technical Overview

The app is served by a single page, `./pages/index.js`, which contains two views: `./views/index/Overview,js` and `./views/index/Details.js`. The overview view includes the map and charts illustrating the current overall health of the road system. The details view is activated when the user selects a hazard and allows the user to dispatch a response to the hazard.

Discrete components and hooks are included in the `./components` directory. Notably, the `useElasticSearch` hook includes the methods for fetching data from elastic and `useNotification` polls for new records.

### External Dependencies

* Map is provided by Mapbox and rendered by `@deck.gl`. This currently uses a hard-coded Mapbox API key (owned by Ryan Duffy)
* Line chart and bar chart are created using `victory` which renders responsive SVG charts
* UI elements are build with `@material-ui`

### Integrations

* Data is pulled from an elastic search (owned by Steve Lemke)
* API requests are routed through an AWS API Gateway (owned by Ryan Duffy) to mitigate CORS issues

## Build and Deploy

### Local Development

Run `npm run dev` to start a dev server which watches for local changes.

### Codesandbox

The repo is also mirrored at https://github.com/ryanjduffy/dtaas-demo. When that repo is updated, visiting https://codesandbox.io/s/github/ryanjduffy/dtaas-demo/tree/main should refresh the sandbox and make the updates available at https://f48mj.sse.codesandbox.io/.

### Build for deployment

Run `npm run export` to create a deployable directory, `out`, of the application.

> This directory should be able to be deployed to any directory of a web server. If you encounter issues with deploying to subdirectories due to absolute paths, debug `assetPath` in `next.config.js`.