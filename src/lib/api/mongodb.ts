import { db } from 'app-config'
import { Db, MongoClient } from 'mongodb'

const { uri, dbName } = db

if (!uri) {
  throw new Error('Database URI not provided')
}

if (!dbName) {
  throw new Error('Database name not provided')
}

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
      useUnifiedTopology: true
    }

    cached.promise = MongoClient.connect(uri as string, opts).then((client) => {
      return {
        client,
        db: client.db(dbName)
      }
    })
  }
  try {
    cached.conn = await cached.promise

    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }

  // return cached.conn
}
