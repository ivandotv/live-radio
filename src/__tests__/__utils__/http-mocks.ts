import { rest } from 'msw'

export const handlers = [
  rest.get('http://ip-api.com/json/:ip', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        countryCode: 'RS'
      })
    )
  })
]
