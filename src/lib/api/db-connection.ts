import { db } from 'app-config'
import { Db, MongoClient } from 'mongodb'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<{
  client: MongoClient
  db: Db
}> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      validateOptions: true
    }

    cached.promise = MongoClient.connect(db.uri as string, opts).then(
      (client) => {
        return {
          client,
          db: client.db(db.dbName)
        }
      }
    )
  }
  try {
    cached.conn = await cached.promise

    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}
