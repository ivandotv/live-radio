import { isDevelopment } from 'lib/server/config'
import { MongoClient, MongoClientOptions } from 'mongodb'

let client: MongoClient
let connectedClient: Promise<MongoClient>

export function getDbConnection(opts: {
  uri: string
  clientOptions?: MongoClientOptions
}) {
  // uri = uri || mongoDb.uri
  // options = options || mongoDb.clientOptions

  if (isDevelopment) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._connectedMongoClient) {
      client = new MongoClient(opts.uri, opts.clientOptions)
      global._connectedMongoClient = client.connect()
    }
    connectedClient = global._connectedMongoClient
  } else {
    client = new MongoClient(opts.uri, opts.clientOptions)
    connectedClient = client.connect()
  }

  return connectedClient
}
