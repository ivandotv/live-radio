import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import request from 'supertest'
import { createTestContainer } from '__tests__/__utils__/utils'

const container = createTestContainer()
const url = '/api/manifest'
let api: ReturnType<typeof withKoaApi>

describe('Manifest', () => {
  beforeEach(() => {
    api = withKoaApi(handler(container))
  })

  test('pick locale based on header', async () => {
    const result = await request(api).get(url).set('accept-language', 'sr')

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/sr/app')
  })

  test('pick locale based on cookie', async () => {
    const result = await request(api)
      .get(url)
      .set('Cookie', ['NEXT_LOCALE=sr;'])

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/sr/app')
  })

  test('pick default locale when no headers or cookies', async () => {
    const result = await request(api).get(url)

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/en/app')
  })

  test('pick default locale when unsupported locale detected', async () => {
    const result = await request(api).get(url).set('accept-language', 'fr')

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/en/app')
  })

  test('fallback to cookie when header locale not supported', async () => {
    const result = await request(api)
      .get(url)
      .set('accept-language', 'fr')
      .set('Cookie', ['NEXT_LOCALE=sr;'])

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/sr/app')
  })
})
