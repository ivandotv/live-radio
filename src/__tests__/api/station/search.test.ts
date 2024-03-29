import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import { RadioBrowserApi } from 'radio-browser-api'
import request from 'supertest'
import { getMockStation } from '__tests__/__utils__/mocks/station-mock'
import { createTestContainer } from '__tests__/__utils__/test-di-container'

const container = createTestContainer().child()

const url = '/api/station/search'
const api = withKoaApi(handler(container))

let radioBrowserMock: { searchStations: jest.Mock }

describe('api/station/search', () => {
  beforeEach(() => {
    radioBrowserMock = {
      searchStations: jest.fn().mockResolvedValue([getMockStation()])
    }
    container.bindValue(RadioBrowserApi, radioBrowserMock)
  })

  afterEach(() => {
    container.unbindAll()
  })

  test('search for station', async () => {
    const query = 'space techno'

    const result = await request(api).post(url).send({ query })

    expect(result.status).toBe(200)

    //TODO - make complete station assertion
    expect(result.body).toEqual({
      stations: [expect.objectContaining({ _id: expect.any(String) })]
    })

    expect(radioBrowserMock.searchStations).toHaveBeenCalledWith(
      expect.objectContaining({ name: query }),
      undefined,
      true
    )
  })

  test('if query is empty, return empty array of stations', async () => {
    const query = ''

    const result = await request(api).post(url).send({ query })

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      stations: []
    })
  })

  test('if query is not present, return 400', async () => {
    const result = await request(api).post(url)

    expect(result.status).toBe(400)
    expect(result.body).toEqual({
      msg: expect.stringContaining('validation failed')
    })
  })

  test('if radio api is not available, return 503', async () => {
    container.unbind(RadioBrowserApi)
    container.bindValue(
      RadioBrowserApi,
      (radioBrowserMock = {
        searchStations: jest.fn().mockRejectedValue(new Error())
      })
    )

    const result = await request(api).post(url).send({ query: 'space techno' })

    expect(result.status).toBe(503)
    expect(result.body).toEqual({
      msg: expect.stringContaining('radio api not available')
    })
  })
})
