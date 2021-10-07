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
