import { MongoClient, MongoClientOptions } from 'mongodb'

// let client: MongoClient
// let connectedClient: Promise<MongoClient>

export function getDbConnection(opts: {
  uri: string
  clientOptions?: MongoClientOptions
}) {
  console.log('db connection options ', opts)

  return new MongoClient(opts.uri, opts.clientOptions).connect()
}
