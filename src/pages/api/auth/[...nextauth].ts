import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { auth } from 'lib/server/config'
import { getDbConnection } from 'lib/server/db-connection'
import { getServerInjector } from 'lib/server/injection-root'
import { logServerError } from 'lib/server/utils'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [GithubProvider(auth.github), GoogleProvider(auth.google)],
  adapter: MongoDBAdapter(
    getServerInjector()
      .resolve<ReturnType<typeof getDbConnection>>(getDbConnection)
      .then((client) => client)
  ),
  secret: auth.signSecret,

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/auth/sign-in' // Displays signin buttons
  },
  logger: {
    error(code, metadata) {
      logServerError(metadata, {
        extra: {
          code
        },
        tags: {
          endpoint: 'auth'
        }
      })
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
