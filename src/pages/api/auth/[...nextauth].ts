import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { SERVER_CONFIG } from 'lib/server/config'
import { getDbConnection } from 'lib/server/db-connection'
import { getServerContainer } from 'lib/server/injection-root'
import { logServerError } from 'lib/server/utils'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GithubProvider(SERVER_CONFIG.auth.github),
    GoogleProvider(SERVER_CONFIG.auth.google)
  ],
  adapter: MongoDBAdapter(
    getServerContainer()
      .resolve<ReturnType<typeof getDbConnection>>(getDbConnection)
      .then((client) => {
        console.log('auth mongo ', SERVER_CONFIG.mongoDb)

        return client
      })
  ),
  secret: SERVER_CONFIG.auth.signSecret,

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
  debug: SERVER_CONFIG.auth.debug
})
