import { logServerError } from 'lib/server/utils'
import { createMocks } from 'node-mocks-http'
import { container, handler } from 'pages/api/song-info'
import { PumpIt } from 'pumpit'

let childContainer: PumpIt

describe('/api/song-info', () => {
  beforeEach(() => {
    childContainer = container.child()
  })

  afterEach(() => {
    childContainer.unbindAll()
  })

  test('get song info', async () => {
    const artist = 'Artist Name'
    const song = 'Song Name'
    const stationUrl = 'some_station_url'

    childContainer.bindValue(
      'getStationInfo',
      jest.fn().mockResolvedValue({ title: `${artist}-${song}` })
    )

    const { req, res } = createMocks({
      method: 'GET',
      query: { station: stationUrl }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getJSONData()).toEqual({ artist, title: song })
  })

  test('If song data cannot be parsed, return an empty object', async () => {
    const stationUrl = 'some_station_url'

    childContainer.bindValue(
      'getStationInfo',
      jest.fn().mockResolvedValue({ title: `` })
    )

    const { req, res } = createMocks({
      method: 'GET',
      query: { station: stationUrl }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getJSONData()).toEqual({})
  })

  test('If station url is not present return status 400', async () => {
    childContainer.bindValue(
      'getStationInfo',
      jest.fn().mockResolvedValue({ title: `` })
    )
    const { req, res } = createMocks({
      method: 'GET'
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getJSONData()).toEqual({ msg: 'station url missing' })
    expect(res.statusCode).toBe(400)
  })

  test('if station info is not available return 503', async () => {
    const errValue = new Error()
    const getStationInfo = jest.fn().mockRejectedValue(errValue)
    const logError = jest.fn()

    childContainer.bindValue('getStationInfo', getStationInfo)
    childContainer.bindValue(logServerError, logError)

    const { req, res } = createMocks({
      method: 'GET',
      query: { station: 'some_url' }
    })

    // @ts-expect-error - req mismatch
    await handler(childContainer)(req, res)

    expect(res._getJSONData()).toEqual({ msg: 'service unavailable' })
    expect(logError).toHaveBeenCalledWith(
      errValue,
      {
        tags: {
          endpoint: 'song-info'
        }
      },
      req.url
    )
    expect(res.statusCode).toBe(503)
  })
})
