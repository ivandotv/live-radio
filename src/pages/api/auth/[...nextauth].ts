import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { ServerConfig } from 'lib/server/config'
import { connectionFactory } from 'lib/server/db-connection'
import { getServerContainer } from 'lib/server/injection-root'
import { logServerError } from 'lib/server/utils'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

/** NextAuth setup */
export default NextAuth({
  providers: [
    GithubProvider(
      getServerContainer().resolve<ServerConfig>('config').auth.github
    ),
    GoogleProvider(
      getServerContainer().resolve<ServerConfig>('config').auth.google
    )
  ],
  adapter: MongoDBAdapter(
    getServerContainer()
      .resolve<ReturnType<typeof connectionFactory>>(connectionFactory)()
      .then((client) => client)
  ),
  secret: getServerContainer().resolve<ServerConfig>('config').auth.signSecret,

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/auth/sign-in' // Displays signin buttons
  },
  logger: {
    error(code, metadata) {
      const logIt =
        getServerContainer().resolve<ReturnType<typeof logServerError>>(
          logServerError
        )

      logIt(metadata, undefined, {
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
  debug: getServerContainer().resolve<ServerConfig>('config').auth.debug
})
