import { booleanEnv } from 'lib/utils'

/**
 * Configuration in this file should not be imported in front end code
 */

export const isProduction = process.env.NODE_ENV === 'production'

export const url =
  process.env.VERCEL_ENV === 'production'
    ? 'https://live-radio.vercel.app'
    : process.env.NEXT_PUBLIC_VERCEL_URL!.replace(/\/$/, '')

export const db = {
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGO_DB_NAME,
  maxCollectionLimit: 100,
  useTransactions: booleanEnv(process.env.DB_USE_TRANSACTIONS, false)
}

export const auth = {
  github: {
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string
  },
  google: {
    clientId: process.env.GOOGLE_ID as string,
    clientSecret: process.env.GOOGLE_SECRET as string
  },
  signSecret: process.env.AUTH_SIGN_SECRET,
  debug: Boolean(process.env.DEBUG_AUTH) ?? false
}
