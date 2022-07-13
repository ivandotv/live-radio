# Online Radio Player

Progressive web application (PWA) for listening to online radio.

## Motivation

The application started as a side project during the covid pandemic. I wanted to have a simple apllication
for listentei to online radio, that is not overrun with ads, and works both on desktop and on mobile.

Then later, it became a test bed for experimentig with diffrent ways to structure a Next.js application (more on that later).

## The setup

Application is built on Next.js framework. It is installable as a PWA, and it can be used anonymously (data is storred in IndexedDB) or as a registered user (data is stored in (Mongo AtlasDB)[https://www.mongodb.com/atlas/database]). Then if you choose to switch from anoynmouse to a registered user, you have the option to import the data from the anonymous account.

Application also supports multiple languages via [Next.js internationalized routing](https://nextjs.org/docs/advanced-features/i18n-routing) and [LinguiJS internationalization library](https://lingui.js.org/).

Radio data is consumed via free and open source [Radio Browser API](https://api.radio-browser.info/).

## Tech Stack

Here I'm going to docoument the main architecture of the application.

### Frontend

#### Configuration

Next.js supports environment variables in the front end at [build time](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser) All frontend configuration is set in one file
and later used via dependency injection.
Take a look at the [configuration file](src/lib/shared/config.ts)
and [injection root](src/lib/client/injection-root.ts#L75)

#### PWA functionality

PWA functionality is made possible via [Workbox](https://developer.chrome.com/docs/workbox/)
Workbox libary is used for:

- controlling the service worker registration and activation
- caching of static data and assets
- notifying the user to **install** the application
- notifying the user **reload** the application when it is updated
- Providing an offline fallback when there is no internet connection

I've also created a [small libary](https://github.com/ivandotv/nextjs-workbox-config) that streamlines setting up
workbox with webpack and Next.js configuration.

#### State management

State is managed via [Mobx](https://mobx.js.org/). I'm a big fan of reactive architecture and I think it's the future of state management as evidenced by Svelte and SolidJS design decisions.

Mobx stores are architected using the root store pattern ([official docs](https://mobx.js.org/defining-data-stores.html#combining-multiple-stores)). I have also [blogged about using this pattern](https://dev.to/ivandotv/mobx-root-store-pattern-with-react-hooks-318d) and made a separate repository (link in the blog post).

I've also used my own[libary](https://github.com/ivandotv/fuerte) on top of Mobx which implements the _collection_ -> _model_ pattern that handles persisting the data in the application.

##### Dependency injection

Next, I've decided to use depenedency injection to connect all the stores, and for that I've used my own small [2KB dependency injection libary](https://github.com/ivandotv/pumpit) that doesn't use decorators for registering and resolving the dependencies, so there is no additional webpack setup, and it can easily be integrated in other libraries and projects.

Take a look at the [frontend injection root](/src/lib/client/injection-root.ts)

> Some people would argue that the state managed is overengeeerd but the purpoes of the application is also to explore different state managemd patterns and architectures.

#### User interface

[Material design version 4](https://v4.mui.com/) is used for the user interface.
The application has two layouts: desktop and mobile.
I've also extracted the app shell layout in to [separate repository](https://github.com/ivandotv/nextjs-material-pwa) so it can easily be reused as a template for buildng Material UI progressive web apps. Check out the [demo](https://material-pwa.vercel.app/)

#### Error handling and tracking

Error handling is done via [react-error-boundary](https://www.npmjs.com/package/react-error-boundary) and error tracking
is done via [Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

### Backend

#### Configuration

Backend configuration is separate from frontend configuration and it is done via environment variables as per [Next.js docs](https://nextjs.org/docs/basic-features/environment-variables) all environment variables are used in only one file, where are they are all validated, and default values are added if needed. This also helps with dependency injection when testing.

Take a look at the [configuration file](src/lib/server/config.ts)

#### Dependency injection

Dependency injection is also used in the backend via [my own library](https://github.com/ivandotv/nextjs-koa-api). Using dependency injection significantly eases architecture complexity and testing (no more Jest module mocking)

You can take a look at the [backend injection root file](/src/lib/server/injection-root.ts)

#### Api routes

If tried something new regarding the Next.js API routes.

If you look in to api directory you will notice that there is only one [route](/src/pages/api/%5B%5B...routes%5D%5D.ts) (disregarding the NextAuth route)
This one and only route is powered by Koa.js, but in order to use Koa.js inside the Next.js API routes I've had
to wrap Kao.js in a bit of custom code which I've also [open sourced](https://github.com/ivandotv/nextjs-koa-api).

That one route behaves as a Koa.js server and does all the internal routing, you can also use all available Koa.js middleware.

#### Error Tracking

Error tracking in the backend is done via Koa.js middleware which internally usees [Pino logger](https://github.com/pinojs/pino) and [Sentry] error tracking.
Take a look at the [middleware](src/lib/server/api/shared-middleware.ts#L95)

## Authentication

- For Authentication [NextAuth](https://next-auth.js.org/) is used in conbination with MongoDb.

## Testing

Testing is done via [Jest](https://jestjs.io/) and [Node test containers](https://github.com/testcontainers/testcontainers-node)

Evey time the tests are run, we start mongodb containers (one DB container per Jest worker file).
I have written a blog post and created an acompying repository on how to: [Test MongoDB and PostgreSQL databases with Jest and Docker containers](https://dev.to/ivandotv/mongodb-and-postgresql-database-testing-with-jest-and-docker-containers-56bc)

There are three types of tests

- Database [repository tests](src/__tests__/database/radio-repository.test.ts)
- API [integration tests](src/__tests__/api)
- [E2E tests](cypress/e2e/) via Cypress (this is work in progress, can't find the time to finish them)

## Data generation

In the [scripts](/scripts/) directory there are a couple of files that are generating special content for the application. Later the generated files are saved in the [generated directory](src/generated/) and imported in the application like any other modules.

- [Generate countries](/scripts/generate-countries.js) generates list of all existing countries and their flags in the form of emoji, and also prepares them for translation.
- [Generate genres](/scripts/generate-genres.js) generates list of music genres and prepares them for translation.
- [Generate languages](/scripts/generate-languages.js) generates list of all existing languages and prepares them for translation.

## Patching packages

I'm using [node-internet-radio](https://github.com/gabek/node-internet-radio) to get the "now playing" information from the radio stream. However there are issues with the package and the mainter is unresponsive. So I've used execellent [patch-package module](https://www.npmjs.com/package/patch-package) to patch (modify) the package myself.

## Translation

Multi language support is done via [Next.js internationalized routing](https://nextjs.org/docs/advanced-features/i18n-routing) and [LinguiJS internationalization library](https://lingui.js.org/).

Default language is English and there are translations for Serbian.
While in the development mode, there is also one additional language called "pseudo" which enables you to visually inspect the application and see if you missed translating any of the text.

I've blogged about [internationalizing Next.js Apps for LogRocket](https://blog.logrocket.com/complete-guide-internationalization-nextjs/). You can [check out the translation demo](https://linguijs-translation-demo.vercel.app/)

If you would like to help me translate the application to more languages please [open an issue](https://github.com/ivandotv/live-radio/issues) with the title: `<Language>[translation]`

## Development experience

Repository is setup to use [VS Code containers](https://code.visualstudio.com/docs/remote/containers-tutorial) everthing works except launching the Cypress Application althou you can still run all Cypress tests but in headless mode.

Repository is also setup to use [Github Codespaces](https://github.com/features/codespaces)

## Future

- Make the app installble via Google play
