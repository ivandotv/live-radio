# Online Radio Player

Progressive web application for listening to online radio

## Motivation

The application started as a side project during the pandemic. I wanted to have a simple apllication
for listentei to online radio, that is not overrun with ads, and works both on desktop and on mobile.

Then later, it became a test bed for experimentig with diffrent ways to structure a Next.js application (more on that later).

## The setup

Application is built on Next.js framework. It is installable as a PWA, and it can be used anonymously (data is storred in IndexedDB)
or as a registered user (data is stored in (Mongo AtlasDB)[https://www.mongodb.com/atlas/database]). Then if you choose to switch from anoynmouse to registered you have the option to import the data from the anonymous account.

Application also supports multiple languages via native [Next.js internationalized routing](https://nextjs.org/docs/advanced-features/i18n-routing) and [LinguiJS](https://lingui.js.org/) javacsrpt internationalization library.

Radio data is consumed via https://api.radio-browser.info/

## Tech Stack

### Frontend

#### PWA

PWA functionality is made possible with [Workbox](https://developer.chrome.com/docs/workbox/)
Workbox libary is used for:

- controlling the service worker registration and activation
- caching of static data and assets
- notifying the user to **install** the application
- notifying the user **reload** the application when it is updated
- Providing an offline fallback when there is no internet connection

I've also implemented a [small module]() that streamlines setting up
workbox with webpack and next.js configuration.

#### Error handling and tracking

Error handling is done via [react-error-boundary](https://www.npmjs.com/package/react-error-boundary) and error tracking
is done via [Sentry configuration for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

#### State management

State is managed via [Mobx](https://mobx.js.org/). I'm a big fan of reactive architecture and I thing it's the future of state management as evidenced by Svelte, SolidJS design decisions.

Mobx stores are architected using the root store pattern ([official docs](https://mobx.js.org/defining-data-stores.html#combining-multiple-stores)). I have also [blogged about using this pattern](https://dev.to/ivandotv/mobx-root-store-pattern-with-react-hooks-318d) and made a separate repository (link in the blog post).

I've also made a [small libary](https://github.com/ivandotv/fuerte) that is built on top of Mobx implementing the _collection_ -> _model_ pattern that handles _saving_ _deletinng_ the data from the app.

Next, I've decided to use depenedency injection to connect all the stores, and for that I've made my own small [dependency injection libary](https://github.com/ivandotv/pumpit) This is a small libary (2KB) that doesn't use decorators for registering and resolving the dependencies, so there is no additional webpack setup , and it can easily be integrated in other librayies and projects.

> Some people would agruge that the state managed is overengeeerd but the purpoes of the application was also to explore different state managemd patterns and architectures.

#### User interface

[Material design version 4](https://v4.mui.com/) is used for the user interface.
The application has two layouts: desktop and mobile.
I've also extracted the app shell layout in to [separate repository](https://github.com/ivandotv/nextjs-material-pwa) so it can easily be reused as a template for buildng Material UI progressive web apps. Check out the [demo](https://material-pwa.vercel.app/)

### Backend

#### Configuration

Configuration is done via environment variabls as per [Next.js docs](https://nextjs.org/docs/basic-features/environment-variables) however, all environment variables as used in only one file, where are they are all validated, and default values are added if needed. This also helps with dependency injection when testing.

Take a look at the [configuration file](src/lib/server/config.ts)

#### Dependency injection

Dependency injection is also used in the backend via [my own library](https://github.com/ivandotv/nextjs-koa-api). Using dependency injection significantly eases architecture complexity and testing (no more Jest module mocking)

You can take a look at the [backend injection root file](/src/lib/server/injection-root.ts)

#### Api routes

If tried something new regarding the Next.js API routes.

If you look in to [api directory](./src/pages/api/) you will notice that there is only one [route](/src/pages/api/%5B%5B...routes%5D%5D.ts) (disregarding the NextAuth route)
This one and only route is powered by Koa.js, but in order to use Koa.js inside the Next.js API routes I've had
to wrap Kao.js in a bit of custom code which I've also [open sourced](https://github.com/ivandotv/nextjs-koa-api).

That one route behaves as a Koa.js server and does all the internal routing, you can also use all available Koa.js middleware.

- depenedency injection

#### Error Tracking

## Authentication

- Talk about next.auth

## Testing

## Tasks

- scripts
-

## Development experience

- vscode containers
- github workspace

## Future

- Install via Google play
