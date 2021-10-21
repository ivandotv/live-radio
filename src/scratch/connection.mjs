import mongodb from 'mongodb'
const { MongoClient } = mongodb
let cached = global.mongo

export const db = {
  uri: 'mongodb://localhost:27017/live-radio',
  dbName: 'live-radio',
  maxCollectionLimit: 100,
  useTransactions: false
}

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  validateOptions: true,
  retryWrites: false
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  try {
    if (!cached.promise) {
      cached.promise = MongoClient.connect(db.uri, opts).then((client) => {
        return {
          client,
          db: client.db(db.dbName)
        }
      })
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
