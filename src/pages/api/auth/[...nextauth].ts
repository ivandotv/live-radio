import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { logger } from 'lib/server/logger'
import * as Sentry from '@sentry/nextjs'
import { getDbConnection } from 'lib/server/db-connection'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { auth } from 'lib/server/config'

export default NextAuth({
  providers: [GithubProvider(auth.github), GoogleProvider(auth.google)],
  adapter: MongoDBAdapter(getDbConnection().then((client) => client)),
  secret: auth.signSecret,

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/auth/sign-in' // Displays signin buttons
  },
  logger: {
    error(code, metadata) {
      logger.error({ code, metadata, tags: { auth: 'next-auth' } })
      Sentry.captureException(metadata, {
        tags: {
          side: 'backend',
          scope: 'auth'
        }
      })

      Sentry.captureException(metadata)
    }
  },
  callbacks: {
    session: async ({ session, token }) => {
      //when using JWT as session, user is undefined, data is in the token
      if (token.id) {
        session.user.id = token.id as string
      }

      return session
    },
    jwt: async ({ token, user }) => {
      if (user) {
        //first sign in
        // add user id
        token.id = user.id
      }

      return token
    }
  },
  debug: auth.debug
})
