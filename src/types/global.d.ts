/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable no-var */
type Db = import('mongodb').Db
type MongoClient = import('mongodb').MongoClient

declare module globalThis {
  var _connectedMongoClient: Promise<MongoClient>
}
