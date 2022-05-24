import { assertEnv, toNumber } from 'lib/shared/utils'

/**
 * ! Configuration in this file should ONLY be used in server side code!
 */

export const nodeEnv = process.env.NODE_ENV

export const isProduction = nodeEnv === 'production'
export const isDevelopment = nodeEnv === 'development'
export const isTest = nodeEnv === 'test'
export const isPreview = process.env.APP_ENV === 'preview'
export const logLevel = process.env.LOG_LEVEL || 'silent'

export const mongoDb = {
  uri: assertEnv('MONGO_DB_URI'),
  dbName: assertEnv('MONGO_DB_NAME'),
  maxRadioCollectionLimit: 100,
  clientOptions: {
    retryWrites: isProduction
    // useTransactions: toBoolean(process.env.DB_USE_TRANSACTIONS, false)
  }
}

export const auth = {
  github: {
    clientId: assertEnv('GITHUB_ID'),
    clientSecret: assertEnv('GITHUB_SECRET'),
    type: 'oauth' as const
  },
  google: {
    clientId: assertEnv('GOOGLE_ID'),
    clientSecret: assertEnv('GOOGLE_SECRET')
  },
  signSecret: assertEnv('AUTH_SIGN_SECRET'),
  debug: isDevelopment
}

// the amount in seconds after which page re-generation can occur
export const revalidate = toNumber(process.env.REVALIDATE, 3600) //one hour
export const customSearchStationLimit = toNumber(
  process.env.CUSTOM_SEARCH_LIMIT,
  2000
)
