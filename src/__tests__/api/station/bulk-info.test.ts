import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import { RadioBrowserApi } from 'radio-browser-api'
import request from 'supertest'
import { getMockStation } from '__tests__/__utils__/mocks/station-mock'
import { createTestContainer } from '__tests__/__utils__/test-di-container'

const container = createTestContainer().child()

const url = '/api/station/bulk-info'
const api = withKoaApi(handler(container))

let radioBrowserMock: { getStationsById: jest.Mock }

describe('api/station/bulk-info', () => {
  beforeEach(() => {
    radioBrowserMock = {
      getStationsById: jest
        .fn()
        .mockResolvedValue([getMockStation(), getMockStation()])
    }

    container.bindValue(RadioBrowserApi, radioBrowserMock)
  })

  afterEach(() => {
    container.unbindAll()
  })

  test('return info successfully', async () => {
    const ids = ['1', '2']

    const result = await request(api).post(url).send({ stations: ids })

    expect(result.status).toBe(200)
    //TODO - make complete station assertion
    expect(result.body).toEqual([
      expect.objectContaining({ _id: expect.any(String) }),
      expect.objectContaining({ _id: expect.any(String) })
    ])

    expect(radioBrowserMock.getStationsById).toHaveBeenCalledWith(ids)
  })

  test('if payload validation fails, return 400', async () => {
    const result = await request(api).post(url).send({ stations: [] })

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
        getStationsById: jest.fn().mockRejectedValue(new Error())
      })
    )

    const result = await request(api)
      .post(url)
      .send({ stations: ['1', '2'] })

    expect(result.status).toBe(503)
    expect(result.body).toEqual({
      msg: expect.stringContaining('radio api not available')
    })
  })

  test('if payload is bigger than 1MB, return 413', async () => {
    const ids2 = Buffer.alloc(1.5e6).toString()

    const result = await request(api).post(url).send({ stations: ids2 })

    expect(result.status).toBe(413)
  })
})
