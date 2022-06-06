import { createMocks } from 'node-mocks-http'
import { handler, container } from 'pages/api/vote-for-station'
import { PumpIt } from 'pumpit'
import { RadioBrowserApi } from 'radio-browser-api'

let childContainer: PumpIt

describe('/api/vote-for-station', () => {
  beforeEach(() => {
    childContainer = container.child()
  })

  afterEach(() => {
    childContainer.unbindAll()
  })

  test('vote for station successfully', async () => {
    const stationId = '123'

    const radioMock = { voteForStation: jest.fn() }
    childContainer.bindValue(RadioBrowserApi, radioMock)

    const { req, res } = createMocks({
      method: 'GET',
      body: { id: stationId }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(radioMock.voteForStation).toHaveBeenCalledWith(stationId)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toEqual({ msg: 'ok' })
  })

  test('return 400 if station id is missing', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(res._getJSONData()).toEqual({ msg: 'station id missing' })
  })

  test('return 503 if radio api errors out', async () => {
    const radioMock = {
      voteForStation: jest.fn().mockRejectedValue(new Error())
    }
    childContainer.bindValue(RadioBrowserApi, radioMock)
    const { req, res } = createMocks({
      method: 'GET',
      body: { id: '123' }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getStatusCode()).toBe(503)
    expect(res._getJSONData()).toEqual({ msg: 'radio api unavailable' })
  })
})
