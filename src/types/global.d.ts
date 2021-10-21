type Db = import('mongodb').Db
type MongoClient = import('mongodb').MongoClient

declare module globalThis {
  var mongo: {
    conn: MongoConnection | null
    promise: Promise<MongoConnection> | null
  }

  type MongoConnection = {
    client: MongoClient
    db: Db
  }
}
