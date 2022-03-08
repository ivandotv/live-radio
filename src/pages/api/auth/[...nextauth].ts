import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { connectToDatabase } from 'lib/api/db-connection'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { auth } from 'server-config'

export default NextAuth({
  providers: [GithubProvider(auth.github), GoogleProvider(auth.google)],
  adapter: MongoDBAdapter(connectToDatabase().then((conn) => conn.client)),
  secret: auth.signSecret,

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/auth/sign-in' // Displays signin buttons
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
