import Joi from 'joi'
import { asNumber, asString } from 'lib/shared/utils'

/**
 * ! Configuration in this file should ONLY be used in server side code!
 */

if (typeof window !== 'undefined') {
  throw new Error('config: use only server side')
}

export type ServerConfig = typeof SERVER_CONFIG

const envSchema = {
  NODE_ENV: asString(
    Joi.string()
      .valid('production', 'development', 'test', 'preview')
      .required()
  ),
  APP_ENV: asString(Joi.string()),
  LOG_LEVEL: asString(Joi.string().default('silent')),
  MONGO_DB_URI: asString(Joi.string().required()),
  MONGO_DB_NAME: asString(
    Joi.string().required().description('database ti treba')
  ),
  GH_ID: asString(Joi.string().required()),
  GH_SECRET: asString(Joi.string().required()),
  GOOGLE_ID: asString(Joi.string().required()),
  GOOGLE_SECRET: asString(Joi.string().required()),
  AUTH_SIGN_SECRET: asString(Joi.string().required()),
  REVALIDATE: asNumber(Joi.number().default(3600)),
  CUSTOM_SEARCH_LIMIT: asNumber(Joi.number().default(2000))
}

const serverConfigSchema = Joi.object<typeof envSchema>()
  .keys(envSchema)
  .unknown()

const { value: envData, error } = serverConfigSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env, { errors: { render: false } })

if (error) {
  throw new Error(`Server config validation error: ${error.message}`)
}

const isProduction = envData.NODE_ENV === 'production'
const isDevelopment = envData.NODE_ENV === 'development'
const isTest = envData.NODE_ENV === 'test'
const isPreview = envData.APP_ENV === 'preview'

export const SERVER_CONFIG = {
  isProduction,
  isDevelopment,
  isTest,
  isPreview,
  nodeEnv: envData.NODE_ENV,
  logLevel: envData.LOG_LEVEL,
  mongoDb: {
    uri: envData.MONGO_DB_URI,
    dbName: envData.MONGO_DB_NAME,
    maxRadioCollectionLimit: 100,
    clientOptions: {
      retryWrites: isProduction
      // useTransactions: toBoolean(process.env.DB_USE_TRANSACTIONS, false)
    }
  },

  auth: {
    github: {
      clientId: envData.GH_ID,
      clientSecret: envData.GH_SECRET,
      type: 'oauth' as const
    },
    google: {
      clientId: envData.GOOGLE_ID,
      clientSecret: envData.GOOGLE_SECRET
    },
    signSecret: envData.AUTH_SIGN_SECRET,
    debug: isDevelopment
  },
  // the amount in seconds after which page re-generation can occur
  revalidate: envData.REVALIDATE,
  customSearchStationLimit: envData.CUSTOM_SEARCH_LIMIT
}
