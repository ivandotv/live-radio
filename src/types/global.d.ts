declare module NodeJS {
  interface Global {
    mongo: {
      conn: MongoConnection | null
      promise: Promise<MongoConnection> | null
    }
  }
  type MongoConnection = {
    client: MongoClient
    db: Db
  }
}
