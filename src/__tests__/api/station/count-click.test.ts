import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import { RadioBrowserApi } from 'radio-browser-api'
import request from 'supertest'
import { createTestContainer } from '__tests__/__utils__/test-di-container'

const container = createTestContainer().child()

const url = '/api/station/click'
const api = withKoaApi(handler(container))

describe('api/station/click', () => {
  afterEach(() => {
    container.unbindAll()
  })

  test('count station click successfully', async () => {
    const stationId = '123'

    const radioMock = { sendStationClick: jest.fn() }
    container.bindValue(RadioBrowserApi, radioMock)

    const result = await request(api).post(url).send({ id: stationId })

    expect(radioMock.sendStationClick).toHaveBeenCalledWith(stationId)
    expect(result.status).toBe(200)
    expect(result.body).toEqual({ msg: 'ok' })
  })

  test('return 400 if station id is missing', async () => {
    const result = await request(api).post(url)

    expect(result.status).toBe(400)
    expect(result.body).toEqual({
      msg: expect.stringContaining('station id missing')
    })
  })

  test('return 200 if radio api errors out', async () => {
    const radioMock = {
      sendStationClick: jest.fn().mockRejectedValue(new Error())
    }
    container.bindValue(RadioBrowserApi, radioMock)

    const result = await request(api).post(url).send({ id: 123 })

    expect(result.status).toBe(200)
  })
})
