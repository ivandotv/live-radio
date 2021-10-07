import { MongoClient } from 'mongodb'
import { db, isProduction } from 'server-config'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  validateOptions: true,
  retryWrites: isProduction
}

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cached.conn) {
    return cached.conn
  }

  try {
    if (!cached.promise) {
      cached.promise = MongoClient.connect(db.uri as string, opts).then(
        (client) => {
          return {
            client,
            db: client.db(db.dbName)
          }
        }
      )
    }
    // eslint-disable-next-line
    cached.conn = await cached.promise // https://github.com/eslint/eslint/issues/11899

    return cached.conn
  } catch (e) {
    cached.promise = null
    cached.conn = null
    throw e
  }
}
