import { withKoaApi } from 'nextjs-koa-api'
import { handler } from 'pages/api/[[...routes]]'
import request from 'supertest'
import { createTestContainer } from '../../__utils__/utils'

const container = createTestContainer()
const url = '/api/manifest'

describe('Manifest', () => {
  test('Pick locale based on header', async () => {
    const result = await request(withKoaApi(handler(container)))
      .get(url)
      .set('accept-language', 'sr')

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/sr/app')
  })

  test('Pick locale based on cookie', async () => {
    const result = await request(withKoaApi(handler(container)))
      .get(url)
      .set('Cookie', ['NEXT_LOCALE=sr;'])

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/sr/app')
  })

  test('Pick default locale when no headers or cookies', async () => {
    const result = await request(withKoaApi(handler(container))).get(url)

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/en/app')
  })

  test('Pick default locale when unsupported locale detected', async () => {
    const result = await request(withKoaApi(handler(container)))
      .get(url)
      .set('accept-language', 'fr')

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/en/app')
  })

  test('Fallback to cookie when header locale not supported', async () => {
    const result = await request(withKoaApi(handler(container)))
      .get(url)
      .set('accept-language', 'fr')
      .set('Cookie', ['NEXT_LOCALE=sr;'])

    expect(result.status).toBe(200)
    expect(result.body.start_url).toMatch('/sr/app')
  })
})
