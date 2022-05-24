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

    await handler(getStationInfo)(req, res)

    expect(res._getJSONData()).toEqual({ artist, title: song })
  })

  test('If song data cannot be parsed, return empty object', async () => {
    const stationUrl = 'some_station_url'

    const getStationInfo = jest.fn().mockResolvedValue({ title: `` })

    const { req, res } = createMocks({
      method: 'GET',
      query: { station: stationUrl }
    })

    await handler(getStationInfo)(req, res)

    expect(res._getJSONData()).toEqual({})
  })

  test('If station url is not present return status 400', async () => {
    const getStationInfo = jest.fn().mockResolvedValue({ title: `` })

    const { req, res } = createMocks({
      method: 'GET'
    })

    await handler(getStationInfo)(req, res)

    expect(res._getJSONData()).toEqual({ msg: 'station url missing' })
    expect(res.statusCode).toBe(400)
  })

  test.todo('if station info is not available return 500')
})
