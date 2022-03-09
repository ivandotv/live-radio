import { booleanEnv } from 'lib/utils/misc-utils'

/**
 * ! Configuration in this file should ONLY be used on server side code!
 */

export const isProduction = process.env.NODE_ENV === 'production'

export const mongoClient = {
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGO_DB_NAME,
  maxCollectionLimit: 100,
  useTransactions: booleanEnv(process.env.DB_USE_TRANSACTIONS, false)
}

export const auth = {
  github: {
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string,
    type: 'oauth'
  },
  google: {
    clientId: process.env.GOOGLE_ID as string,
    clientSecret: process.env.GOOGLE_SECRET as string
  },
  signSecret: process.env.AUTH_SIGN_SECRET,
  debug: Boolean(process.env.DEBUG_AUTH) ?? false
} as const

// the amount in seconds after which a page re-generation can occur
export const revalidate = 3600 //one hour
