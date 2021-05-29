import { auth, db } from 'app-config'
// import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { Account, Profile, User } from 'next-auth'
import Providers from 'next-auth/providers'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export default NextAuth({
  providers: [Providers.GitHub(auth.github), Providers.Google(auth.google)],
  database: {
    type: 'mongodb',
    url: db.uri,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  secret: auth.signSecret,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // You can define custom pages to override the built-in pages.
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: '/auth/sign-in' // Displays signin buttons
    // signOut: '/api/auth/signout', // Displays form with sign out button
    // error: '/api/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/api/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // signIn: async (user, account, profile) => { return Promise.resolve(true) },
    // redirect: async (url, baseUrl) => { return Promise.resolve(baseUrl) },
    session: async (session: any, user: any) => {
      if (user.id) {
        session.user.id = user.id
      }

      return Promise.resolve(session)
    },
    jwt: async (
      token: any,
      user: User,
      _account: Account,
      _profile: Profile,
      _isNewUser: boolean
    ) => {
      console.log(token)
      console.log(user)
      if (user) {
        //first sign in
        // add user id
        token.id = user.id
      }

      return Promise.resolve(token)
    }
  },
  debug: auth.debug
})
