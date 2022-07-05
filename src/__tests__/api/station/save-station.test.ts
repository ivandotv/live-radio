import { faker } from '@faker-js/faker'
import { ServerConfig } from 'lib/server/config'
import { connectionFactory } from 'lib/server/db-connection'
import { getSession } from 'next-auth/react'
import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import { RadioBrowserApi } from 'radio-browser-api'
import request from 'supertest'
import { seedDatabase } from '__tests__/__utils__/db-utils'
import { createRadioBrowserMock } from '__tests__/__utils__/mocks/radio-browser-mock'
import { sessionMock } from '__tests__/__utils__/mocks/session-mock'
import { createTestContainer } from '__tests__/__utils__/test-di-container'

const container = createTestContainer()
const url = '/api/station'
const api = withKoaApi(handler(container))

let users: Awaited<ReturnType<typeof seedDatabase>>
let client: MongoClient
let dbName: string

describe('/api/station', () => {
  describe('save', () => {
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
      container
        .bindValue(getSession, sessionMock(users.userWithEmptyCollections))
        .bindValue(
          RadioBrowserApi,
          createRadioBrowserMock({
            voteForStation: jest.fn().mockResolvedValue({})
          })
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

    test('save successfully', async () => {
      const collection = 'favorites'
      const station = faker.datatype.uuid()

      const result = await request(api).post(url).send({ collection, station })

      expect(result.status).toBe(201)
      expect(result.body).toEqual({ msg: 'ok' })
    })

    test('if trying to save already saved station, override previous', async () => {
      const collection = 'recent'
      const station = faker.datatype.uuid()

      await request(api).post(url).send({ collection, station })
      const result = await request(api).post(url).send({ collection, station })

      expect(result.status).toBe(201)
      expect(result.body).toEqual({ msg: 'ok' })
    })

    test('if the station is saved in the "favorites" collection, "vote" for station via radio api', async () => {
      const collection = 'favorites'
      const station = faker.datatype.uuid()
      const radioBrowserMock = createRadioBrowserMock({
        voteForStation: jest.fn().mockResolvedValue({}),
        nick: 'ikac'
      })

      container.unbind(RadioBrowserApi)
      container.bindValue(RadioBrowserApi, radioBrowserMock)

      await request(api).post(url).send({ collection, station })

      expect(radioBrowserMock.voteForStation).toHaveBeenCalledWith(station)
    })

    test('if station parameter is missing, return 400', async () => {
      const collection = 'favorites'

      const result = await request(api).post(url).send({ collection })

      expect(result.status).toBe(400)
      expect(result.body).toEqual({ msg: 'validation failed' })
    })

    test('if collection query parameter is missing, return 400', async () => {
      const result = await request(api).post(url).send({ station: '123' })

      expect(result.status).toBe(400)
      expect(result.body).toEqual({ msg: 'validation failed' })
    })

    test('if the user is not authenticated, return 401', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, () => Promise.resolve(null))

      const result = await request(api).post(url)

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
