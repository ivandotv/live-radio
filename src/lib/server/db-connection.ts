import { MongoClient, MongoClientOptions } from 'mongodb'
import { isDevelopment, mongoDb } from 'lib/server/config'

let client: MongoClient
let connectedClient: Promise<MongoClient>

export function getDbConnection(uri?: string, options?: MongoClientOptions) {
  uri = uri || mongoDb.uri
  options = options || mongoDb.clientOptions

  if (isDevelopment) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._connectedMongoClient) {
      client = new MongoClient(uri, options)
      global._connectedMongoClient = client.connect()
    }
    connectedClient = global._connectedMongoClient
  } else {
    client = new MongoClient(uri, options)
    connectedClient = client.connect()
  }

  return connectedClient
}
