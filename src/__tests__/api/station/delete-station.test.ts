import { ServerConfig } from 'lib/server/config'
import { connectionFactory } from 'lib/server/db-connection'
import { getSession } from 'next-auth/react'
import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import request from 'supertest'
import { seedDatabase } from '__tests__/__utils__/db-utils'
import { sessionMock } from '__tests__/__utils__/mocks/session-mock'
import { createTestContainer } from '__tests__/__utils__/test-di-container'

const container = createTestContainer()
const url = '/api/station'
const api = withKoaApi(handler(container))

let users: Awaited<ReturnType<typeof seedDatabase>>
let client: MongoClient
let dbName: string

describe('/api/station', () => {
  describe('delete', () => {
    beforeAll(async () => {
      const config = container.resolve<ServerConfig>('config')

      dbName = config.mongoDb.dbName
      client = await container.resolve<ReturnType<typeof connectionFactory>>(
        connectionFactory
      )()
    })

    beforeEach(async () => {
      //seed the db
      users = await seedDatabase(client, dbName)
      container.bindValue(
        getSession,
        sessionMock(users.userWithFiveStationsInCollection)
      )
    })

    afterEach(async () => {
      //drop the db
      await client.db(dbName).dropDatabase()

      container.unbindAll()
    })

    afterAll(async () => {
      //close connection to the database
      await client.close()
    })

    test('delete successfully', async () => {
      const collection = 'favorites'
      const station = users.userWithFiveStationsInCollection[collection][0]._id

      const result = await request(api)
        .delete(url)
        .query({ collection, station })

      expect(result.status).toBe(200)
    })

    test('if trying to delete already deleted station, return 404', async () => {
      const collection = 'recent'
      const station = users.userWithFiveStationsInCollection[collection][0]._id

      await request(api).delete(url).query({ collection, station })

      const result = await request(api)
        .delete(url)
        .query({ collection, station })

      expect(result.status).toBe(404)
    })

    test('if station query parameter is missing, return 400', async () => {
      const collection = 'favorites'

      const result = await request(api).delete(url).query({ collection })

      expect(result.status).toBe(400)
      expect(result.body).toEqual({ msg: 'validation failed' })
    })

    test('if collection query parameter is missing, return 400', async () => {
      const result = await request(api).delete(url).query({ station: '123' })

      expect(result.status).toBe(400)
      expect(result.body).toEqual({ msg: 'validation failed' })
    })

    test('if the station is not found, return 404', async () => {
      const result = await request(api)
        .delete(url)
        .query({ collection: 'favorites', station: 'does_not_exist' })

      expect(result.status).toBe(404)
      expect(result.body).toEqual({ msg: 'station not found' })
    })

    test('if the user is not authenticated, return 401', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, () => Promise.resolve(null))

      const result = await request(api).delete(url)

      expect(result.status).toBe(401)
      expect(result.body).toEqual({ msg: 'not authenticated' })
    })

    test('if session throws error, return 500', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, () => Promise.reject(new Error()))

      const result = await request(api).delete(url)

      expect(result.status).toBe(500)
      expect(result.body).toEqual({ msg: 'internal server error' })
    })
  })
})
