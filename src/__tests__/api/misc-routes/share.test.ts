import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import request from 'supertest'
import { createTestContainer } from '__tests__/__utils__/utils'

const container = createTestContainer()
const url = '/api/share'
const api = withKoaApi(handler(container))

describe('/api/share', () => {
  test('redirect', async () => {
    const stationId = '123'

    const result = await request(api).get(url).query({ play: stationId })

    expect(result.status).toBe(302)
    expect(result.header.location).toBe(`/en/app?play=${stationId}`)
    expect(result.body).toEqual({})
  })

  test('redirect with appropriate locale', async () => {
    const stationId = '123'

    const result = await request(api)
      .get(url)
      .set('accept-language', 'sr')
      .query({ play: stationId })

    expect(result.status).toBe(302)
    expect(result.header.location).toBe(`/sr/app?play=${stationId}`)
    expect(result.body).toEqual({})
  })

  test('if locale is not supported redirect to default locale', async () => {
    const stationId = '123'

    const result = await request(api)
      .get(url)
      .set('accept-language', 'fr')
      .query({ play: stationId })

    expect(result.status).toBe(302)
    expect(result.header.location).toBe(`/en/app?play=${stationId}`)
    expect(result.body).toEqual({})
  })

  test('if query is missing, redirect to the root of the site', async () => {
    const result = await request(api).get(url).set('accept-language', 'sr')

    expect(result.status).toBe(302)
    expect(result.header.location).toBe('/')
    expect(result.body).toEqual({})
  })
})
