import { ServerConfig } from 'lib/server/config'
import { connectionFactory } from 'lib/server/db-connection'
import { RadioDTO } from 'lib/shared/utils'
import { getSession } from 'next-auth/react'
import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import { RadioBrowserApi } from 'radio-browser-api'
import request from 'supertest'
import { seedDatabase } from '__tests__/__utils__/db-utils'
import {
  createRadioBrowserMock,
  RadioBrowserMock
} from '__tests__/__utils__/mocks/radio-browser-mock'
import { sessionMock } from '__tests__/__utils__/mocks/session-mock'
import { createTestContainer } from '__tests__/__utils__/test-container'

const container = createTestContainer().child()
const url = '/api/collection'
const api = withKoaApi(handler(container))

let radioBrowserMock: RadioBrowserMock
let users: Awaited<ReturnType<typeof seedDatabase>>
let client: MongoClient
let dbName: string

describe('api/collection', () => {
  describe('get', () => {
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

      radioBrowserMock = createRadioBrowserMock()

      container.bindValue(RadioBrowserApi, radioBrowserMock)
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

    test('get collection', async () => {
      const collection = 'favorites'

      const stationIds = users.userWithFiveStationsInCollection[collection].map(
        (station) => station._id
      )
      const result = await request(api).get(`${url}/${collection}`)

      for (let i = 0; i < result.body.length; i++) {
        const station: RadioDTO = result.body[i]
        expect(station._id).toBe(stationIds[i])
      }
      expect(result.body.length).toBeGreaterThan(0)
      expect(result.status).toBe(200)
      expect(radioBrowserMock.getStationsById!).toHaveBeenCalledWith(stationIds)
    })

    test('if user does not have the collection return empty array', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, sessionMock(users.userWithNoCollections))
      const collection = 'favorites'

      const result = await request(api).get(`${url}/${collection}`)

      expect(result.body).toHaveLength(0)
      expect(result.status).toBe(200)
      expect(radioBrowserMock.getStationsById!).not.toHaveBeenCalled()
    })

    test('if user collection is empty, return empty array', async () => {
      container.unbind(getSession)
      container.bindValue(
        getSession,
        sessionMock(users.userWithEmptyCollections)
      )
      const collection = 'favorites'

      const result = await request(api).get(`${url}/${collection}`)

      expect(result.body).toHaveLength(0)
      expect(result.status).toBe(200)
      expect(radioBrowserMock.getStationsById!).not.toHaveBeenCalled()
    })

    test("if collection can't be found, return 404", async () => {
      const collection = 'my_pop_songs'
      const result = await request(api).get(`${url}/${collection}`)

      expect(result.status).toBe(404)
      expect(result.body).toEqual({
        msg: expect.stringContaining('collection not found')
      })
    })

    test('if radio api is not available, return 503', async () => {
      const radioBrowserMock = createRadioBrowserMock({
        getStationsById: jest.fn().mockRejectedValue(new Error())
      })
      container.unbind(RadioBrowserApi)
      container.bindValue(RadioBrowserApi, radioBrowserMock)

      const collection = 'favorites'
      const result = await request(api).get(`${url}/${collection}`)

      expect(result.status).toBe(503)
      expect(result.body).toEqual({
        msg: expect.stringContaining('radio api not available')
      })
    })

    test('if the user is not authenticated, return 401', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, () => Promise.resolve(null))

      const collection = 'favorites'
      const result = await request(api).get(`${url}/${collection}`)

      expect(result.status).toBe(401)
      expect(result.body).toEqual({ msg: 'not authenticated' })
    })

    test('if session throws error, return 500', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, () => Promise.reject(new Error()))

      const collection = 'favorites'
      const result = await request(api).get(`${url}/${collection}`)

      expect(result.status).toBe(500)
      expect(result.body).toEqual({ msg: 'internal server error' })
    })
  })
})
