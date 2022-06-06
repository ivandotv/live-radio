import { createMocks } from 'node-mocks-http'
import { handler, container } from 'pages/api/station-click'
import { PumpIt } from 'pumpit'
import { RadioBrowserApi } from 'radio-browser-api'

let childContainer: PumpIt

describe('/api/station-click', () => {
  beforeEach(() => {
    childContainer = container.child()
  })

  afterEach(() => {
    childContainer.unbindAll()
  })

  test('count station click successfully', async () => {
    const stationId = '123'

    const radioMock = { sendStationClick: jest.fn() }
    childContainer.bindValue(RadioBrowserApi, radioMock)

    const { req, res } = createMocks({
      method: 'GET',
      body: { id: stationId }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(radioMock.sendStationClick).toHaveBeenCalledWith(stationId)
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
