import { createMocks } from 'node-mocks-http'
import { handler, container } from 'pages/api/share'
import { PumpIt } from 'pumpit'

let childContainer: PumpIt

describe('/api/share', () => {
  beforeEach(() => {
    childContainer = container.child()
  })

  afterEach(() => {
    childContainer.unbindAll()
  })

  test('share song url successfully', async () => {
    const stationId = '123'

    const { req, res } = createMocks({
      method: 'GET',
      query: { play: stationId }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getStatusCode()).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/app?play=${stationId}`)
  })
  test('if song url is missing, redirect to root url', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getStatusCode()).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/`)
  })

  test('redirect to supported language', async () => {
    const stationId = '123'

    const { req, res } = createMocks({
      method: 'GET',
      query: { play: stationId },
      headers: {
        'accept-language': 'en-US,en;q=0.9,de;q=0.8,ru;q=0.7'
      }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getStatusCode()).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/en/app?play=${stationId}`)
  })

  test('if language cannot be found, redirect to default language', async () => {
    const stationId = '123'

    const { req, res } = createMocks({
      method: 'GET',
      query: { play: stationId },
      headers: {
        'accept-language': 'ru-RU'
      }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getStatusCode()).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/app?play=${stationId}`)
  })

  test('if accept-languge header is missing, redirect to default language', async () => {
    const stationId = '123'

    const { req, res } = createMocks({
      method: 'GET',
      query: { play: stationId }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getStatusCode()).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/app?play=${stationId}`)
  })
})
