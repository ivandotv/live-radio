import faker from '@faker-js/faker'
import { ServerConfig } from 'lib/server/config'
import { connectionFactory } from 'lib/server/db-connection'
import { RadioDTO } from 'lib/shared/utils'
import { getSession } from 'next-auth/react'
import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import { RadioBrowserApi } from 'radio-browser-api'
import request from 'supertest'
import { createStations, seedDatabase } from '__tests__/__utils__/db-utils'
import {
  createRadioBrowserMock,
  RadioBrowserMock
} from '__tests__/__utils__/mocks/radio-browser-mock'
import { sessionMock } from '__tests__/__utils__/mocks/session-mock'
import { createTestContainer } from '__tests__/__utils__/test-container'

faker.seed(1)

const container = createTestContainer().child()
const url = '/api/collection'
const api = withKoaApi(handler(container))

let radioBrowserMock: RadioBrowserMock
let users: Awaited<ReturnType<typeof seedDatabase>>
let client: MongoClient
let dbName: string

function createPayload(favCount: number, recentCount: number) {
  return {
    favorites: createStations(favCount).map((station) => {
      return {
        station: station._id,
        date: station.date
      }
    }),
    recent: createStations(recentCount).map((station) => {
      return {
        station: station._id,
        date: station.date
      }
    })
  }
}

describe('api/collection', () => {
  describe('batch import', () => {
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
        sessionMock(users.userWithEmptyCollections)
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

    test('save collection', async () => {
      const { favorites, recent } = createPayload(3, 3)

      const result = await request(api).post(`${url}/batch/import`).send({
        favorites,
        recent
      })

      const getFavorites = await request(api).get(`${url}/favorites`)
      const getRecent = await request(api).get(`${url}/recent`)

      for (let i = 0; i < getFavorites.body.length; i++) {
        const station: RadioDTO = getFavorites.body[i]
        expect(station._id).toBe(favorites[i].station)
      }

      for (let i = 0; i < getRecent.body.length; i++) {
        const station: RadioDTO = getRecent.body[i]
        expect(station._id).toBe(recent[i].station)
      }

      expect(result.status).toBe(201)
      expect(radioBrowserMock.getStationsById!).nthCalledWith(
        1,
        favorites.map((station) => station.station)
      )
      expect(radioBrowserMock.getStationsById!).nthCalledWith(
        2,
        recent.map((station) => station.station)
      )
    })

    test('saving collection is idempotent', async () => {
      const { favorites, recent } = createPayload(3, 3)

      await request(api).post(`${url}/batch/import`).send({
        favorites,
        recent
      })

      await request(api).post(`${url}/batch/import`).send({
        favorites,
        recent
      })

      await request(api).post(`${url}/batch/import`).send({
        favorites,
        recent
      })

      const getFavorites = await request(api).get(`${url}/favorites`)
      const getRecent = await request(api).get(`${url}/recent`)

      for (let i = 0; i < getFavorites.body.length; i++) {
        const station: RadioDTO = getFavorites.body[i]
        expect(station._id).toBe(favorites[i].station)
      }

      for (let i = 0; i < getRecent.body.length; i++) {
        const station: RadioDTO = getRecent.body[i]
        expect(station._id).toBe(recent[i].station)
      }
    })

    test('if payload has wrong collection name, return 400', async () => {
      const result = await request(api).post(`${url}/batch/import`).send({
        wrong_collection: [],
        favorites: []
      })

      expect(result.status).toBe(400)
    })

    test('if payload has wrong station data, return 400', async () => {
      const result = await request(api)
        .post(`${url}/batch/import`)
        .send({
          recent: [{ station: 'wrong_station', data: '2020-01-01' }],
          favorites: []
        })

      expect(result.status).toBe(400)
    })

    test('if radio api is not available, return 503', async () => {
      const radioBrowserMock = createRadioBrowserMock({
        getStationsById: jest.fn().mockRejectedValue(new Error())
      })
      container.unbind(RadioBrowserApi)
      container.bindValue(RadioBrowserApi, radioBrowserMock)

      const { favorites, recent } = createPayload(3, 3)
      const result = await request(api).post(`${url}/batch/import`).send({
        favorites,
        recent
      })

      expect(result.status).toBe(503)
      expect(result.body).toEqual({
        msg: expect.stringContaining('radio api not available')
      })
    })

    test('if the user is not authenticated, return 401', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, () => Promise.resolve(null))

      const { favorites, recent } = createPayload(3, 3)
      const result = await request(api).post(`${url}/batch/import`).send({
        favorites,
        recent
      })

      expect(result.status).toBe(401)
      expect(result.body).toEqual({ msg: 'not authenticated' })
    })

    test('if session throws error, return 500', async () => {
      container.unbind(getSession)
      container.bindValue(getSession, () => Promise.reject(new Error()))

      const { favorites, recent } = createPayload(3, 3)
      const result = await request(api).post(`${url}/batch/import`).send({
        favorites,
        recent
      })

      expect(result.status).toBe(500)
      expect(result.body).toEqual({ msg: 'internal server error' })
    })
  })
})
