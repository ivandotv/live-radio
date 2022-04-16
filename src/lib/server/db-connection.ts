import { MongoClient, MongoClientOptions } from 'mongodb'
import { mongoDb } from 'lib/server/config'

let client: MongoClient
let connectedClient: Promise<MongoClient>

export function getDbConnection(uri?: string, options?: MongoClientOptions) {
  uri = uri || mongoDb.uri
  options = options || mongoDb.clientOptions

  if (!global._connectedMongoClient) {
    client = new MongoClient(uri, options)
    global._connectedMongoClient = client.connect()
  }
  connectedClient = global._connectedMongoClient

  return connectedClient
}
