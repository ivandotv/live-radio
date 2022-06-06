import { faker } from '@faker-js/faker'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { createMocks } from 'node-mocks-http'
import { container, handler } from 'pages/api/geolocation'
import { PumpIt } from 'pumpit'

let childContainer: PumpIt

const countryCode = {
  code: 'RS',
  cont: 'EU',
  flag: '🇷🇸',
  name: 'Serbia'
}

const server = setupServer(
  rest.get('http://ip-api.com/json/:ip', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        countryCode: countryCode.code
      })
    )
  })
)

describe('/api/geolocation', () => {
  beforeAll(() => {
    server.listen()
  })

  beforeEach(() => {
    childContainer = container.child()
  })

  afterEach(() => {
    server.resetHandlers()
    childContainer.unbindAll()
  })

  afterAll(() => {
    server.close()
  })

  test('get geolocation successfully', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        'X-Client-IP': faker.internet.ip()
      }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toEqual(countryCode)
  })

  test.todo('return 503 if ip-api.com errors out')
  test.todo('return 503 if ip-api.com returns invalid data')
  test.todo('return 503 if localhost ip is detected')
  test.todo('return 503 if cannot parse country data')
})
