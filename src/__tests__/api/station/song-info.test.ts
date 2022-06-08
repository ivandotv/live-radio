import { getSongInfo } from 'lib/server/utils'
import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import request from 'supertest'
import { createTestContainer } from '__tests__/__utils__/utils'

const artist = 'Artist Name'
const song = 'Song Name'
const stationUrl = 'some_station_url'

const container = createTestContainer().child()

const url = '/api/station/song-info'
const api = withKoaApi(handler(container))

describe('api/station/song-info', () => {
  afterEach(() => {
    container.unbindAll()
  })

  test('get song info', async () => {
    container.bindValue(
      getSongInfo,
      jest.fn().mockResolvedValue({ title: `${artist}-${song}` })
    )
    const result = await request(api).get(url).query({ station: stationUrl })

    expect(result.status).toBe(200)
    expect(result.body).toEqual({ artist, title: song })
  })

  test('If song data cannot be parsed, return an empty object', async () => {
    container.bindValue(getSongInfo, jest.fn().mockResolvedValue({ title: `` }))

    const result = await request(api).get(url).query({ station: stationUrl })

    expect(result.body).toEqual({})
  })

  test('If station query is not present return status 400', async () => {
    const result = await request(api).get(url)

    expect(result.status).toBe(400)
    expect(result.body).toEqual({ msg: expect.stringContaining('url missing') })
  })

  test('if station info is not available return 204', async () => {
    const errValue = new Error()
    container.bindValue(getSongInfo, jest.fn().mockRejectedValue(errValue))

    const result = await request(api).get(url).query({ station: stationUrl })

    expect(result.status).toBe(204)
    expect(result.body).toEqual({})
  })
})
