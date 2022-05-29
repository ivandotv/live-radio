import { createMocks } from 'node-mocks-http'
import { handler } from 'pages/api/song-info'

describe('/api/sonf-info', () => {
  test('get song info', async () => {
    const artist = 'Artist Name'
    const song = 'Song Name'
    const stationUrl = 'some_station_url'

    const getStationInfo = jest
      .fn()
      .mockResolvedValue({ title: `${artist}-${song}` })

    const { req, res } = createMocks({
      method: 'GET',
      query: { station: stationUrl }
    })

    // @ts-expect-error - req mismatch
    await handler(getStationInfo)(req, res)

    expect(res._getJSONData()).toEqual({ artist, title: song })
  })

  test('If song data cannot be parsed, return an empty object', async () => {
    const stationUrl = 'some_station_url'

    const getStationInfo = jest.fn().mockResolvedValue({ title: `` })

    const { req, res } = createMocks({
      method: 'GET',
      query: { station: stationUrl }
    })

    // @ts-expect-error - req mismatch
    await handler(getStationInfo)(req, res)

    expect(res._getJSONData()).toEqual({})
  })

  test('If station url is not present return status 400', async () => {
    const getStationInfo = jest.fn().mockResolvedValue({ title: `` })

    const { req, res } = createMocks({
      method: 'GET'
    })

    // @ts-expect-error - req mismatch
    await handler(getStationInfo)(req, res)

    expect(res._getJSONData()).toEqual({ msg: 'station url missing' })
    expect(res.statusCode).toBe(400)
  })

  test('if station info is not available return 503', async () => {
    const errValue = new Error()
    const getStationInfo = jest.fn().mockRejectedValue(errValue)
    const logError = jest.fn()

    const { req, res } = createMocks({
      method: 'GET',
      query: { station: 'some_url' }
    })

    // @ts-expect-error - req mismatch
    await handler(getStationInfo, logError)(req, res)

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
