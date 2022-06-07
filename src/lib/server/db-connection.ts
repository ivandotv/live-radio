import { MongoClient } from 'mongodb'
import { ServerConfig } from './config'

connectionFactory.inject = ['config']
export function connectionFactory(config: ServerConfig) {
  const uri = config.mongoDb.uri
  const clientOptions = config.mongoDb.clientOptions

  let client: Promise<MongoClient>

  return async () => {
    if (!client) {
      console.log('create mongodb client')
      client = new MongoClient(uri, clientOptions).connect()
    }

    return client
  }
}
