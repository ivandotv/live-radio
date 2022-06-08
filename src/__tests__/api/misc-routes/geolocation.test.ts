import { faker } from '@faker-js/faker'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import request from 'supertest'
import { createTestContainer } from '__tests__/__utils__/utils'

const clientIp = faker.internet.ip()
const geolocationApi = 'http://ip-api.com/json/:ip'

const container = createTestContainer()
const url = '/api/geolocation'
const api = withKoaApi(handler(container))

const countryCode = {
  code: 'RS',
  cont: 'EU',
  flag: '🇷🇸',
  name: 'Serbia'
}

const server = setupServer(
  rest.get(geolocationApi, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        countryCode: countryCode.code
      })
    )
  })
)

describe('Geolocation', () => {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: ({ url }, print) => {
        if (!url.pathname.startsWith('/api')) {
          print.warning()
        }
      }
    })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  test('get geolocation successfully', async () => {
    const result = await request(api).get(url).set('X-Client-IP', clientIp)

    expect(result.status).toBe(200)
    expect(result.body).toEqual(countryCode)
  })

  test('return 503 if ip-api.com errors out', async () => {
    server.use(
      rest.get(geolocationApi, (req, res, ctx) => {
        return res(
          ctx.status(503),
          ctx.json({
            error: 'Service Unavailable'
          })
        )
      })
    )

    const result = await request(api).get(url).set('X-Client-IP', clientIp)

    expect(result.status).toBe(503)
    expect(result.body).toEqual({ msg: `can't fetch ip info` })
  })

  test('return 503 if ip-api.com returns invalid data', async () => {
    server.use(
      rest.get(geolocationApi, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            countryCode: 'INVALID'
          })
        )
      })
    )

    const result = await request(api).get(url).set('X-Client-IP', clientIp)

    expect(result.body).toEqual({
      msg: expect.stringContaining("Can't parse location data")
    })
    expect(result.status).toBe(503)
  })

  test('return 503 if localhost ip is detected', async () => {
    const result = await request(api).get(url).set('X-Client-IP', '::')

    expect(result.body).toEqual({
      msg: expect.stringContaining("can't detect ip")
    })
    expect(result.status).toBe(503)
  })
})
