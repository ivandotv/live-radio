import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import { RadioBrowserApi } from 'radio-browser-api'
import request from 'supertest'
import {
  createRadioBrowserMock,
  RadioBrowserMock
} from '__tests__/__utils__/mocks/radio-browser-mock'
import { createTestContainer } from '__tests__/__utils__/test-di-container'

const container = createTestContainer().child()
const url = '/api/station'
const api = withKoaApi(handler(container))

let radioBrowserMock: RadioBrowserMock

describe('api/station', () => {
  describe('get', () => {
    beforeEach(() => {
      radioBrowserMock = createRadioBrowserMock()

      container.bindValue(RadioBrowserApi, radioBrowserMock)
    })

    afterEach(() => {
      container.unbindAll()
    })

    test('get by id', async () => {
      const play = '123'

      const result = await request(api).get(url).query({ play })

      expect(result.status).toBe(200)

      //TODO - make complete station assertion
      expect(result.body).toEqual([
        expect.objectContaining({ _id: expect.any(String) })
      ])

      expect(radioBrowserMock.getStationsById!).toHaveBeenLastCalledWith(
        expect.objectContaining([play])
      )
    })

    test("if station can't be found, return 404", async () => {
      const radioBrowserMock = createRadioBrowserMock({
        getStationsById: jest.fn().mockResolvedValue([])
      })
      container.unbind(RadioBrowserApi)
      container.bindValue(RadioBrowserApi, radioBrowserMock)
      const play = '123'

      const result = await request(api).get(url).query({ play })

      expect(result.status).toBe(404)
      expect(result.body).toEqual({
        msg: expect.stringContaining('station not found')
      })

      expect(radioBrowserMock.getStationsById).toHaveBeenCalledWith(
        expect.objectContaining([play])
      )
    })

    test('if station id is missing, return 400', async () => {
      const result = await request(api).get(url)

      expect(result.status).toBe(400)
      expect(result.body).toEqual({
        msg: expect.stringContaining('validation failed')
      })
    })

    test('if radio api is not available, return 503', async () => {
      const radioBrowserMock = createRadioBrowserMock({
        getStationsById: jest.fn().mockRejectedValue(new Error())
      })
      container.unbind(RadioBrowserApi)
      container.bindValue(RadioBrowserApi, radioBrowserMock)
      const play = '123'

      const result = await request(api).get(url).query({ play })

      expect(result.status).toBe(503)
      expect(result.body).toEqual({
        msg: expect.stringContaining('radio api not available')
      })
    })
  })
})
