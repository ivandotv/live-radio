import { ServerConfig } from 'lib/server/config'
import { connectionFactory } from 'lib/server/db-connection'
import { getSession } from 'next-auth/react'
import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import request from 'supertest'
import { seedDatabase } from '__tests__/__utils__/db-utils'
import { sessionMock } from '__tests__/__utils__/mocks/session-mock'
import { createTestContainer } from '__tests__/__utils__/test-di-container'

const container = createTestContainer().child()
const url = '/api/collection'
const api = withKoaApi(handler(container))

let users: Awaited<ReturnType<typeof seedDatabase>>
let client: MongoClient
let dbName: string

describe('api/collection', () => {
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

    test('delete collection', async () => {
      const collection = 'favorites'

      const result = await request(api).delete(`${url}/${collection}`)

      const getResult = await request(api).get(`${url}/${collection}`)

      expect(result.status).toBe(200)
      expect(result.body).toEqual({ msg: 'ok' })

      expect(getResult.body).toEqual([])
    })

    /* Note: I could (should) return 404 when trying to delete the collection
    that doesn't exist, but that would require me to first check if the collection exists
    in the database before trying to delete it.
    */
    test('if the user does not have the collection, retrun 200', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, sessionMock(users.userWithNoCollections))
      const collection = 'favorites'

      const result = await request(api).delete(`${url}/${collection}`)

      expect(result.status).toBe(200)
      expect(result.body).toEqual({ msg: 'ok' })
    })

    test("if collection can't be found, return 404", async () => {
      const collection = 'my_pop_songs'
      const result = await request(api).delete(`${url}/${collection}`)

      expect(result.status).toBe(404)
      expect(result.body).toEqual({
        msg: expect.stringContaining('collection not found')
      })
    })

    test('if the user is not authenticated, return 401', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, () => Promise.resolve(null))

      const collection = 'favorites'
      const result = await request(api).delete(`${url}/${collection}`)

      expect(result.status).toBe(401)
      expect(result.body).toEqual({ msg: 'not authenticated' })
    })

    test('if session throws error, return 500', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, () => Promise.reject(new Error()))

      const collection = 'favorites'
      const result = await request(api).delete(`${url}/${collection}`)

      expect(result.status).toBe(500)
      expect(result.body).toEqual({ msg: 'internal server error' })
    })
  })
})
