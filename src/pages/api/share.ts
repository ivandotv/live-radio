import { NextApiRequest, NextApiResponse } from 'next'
import parser from 'accept-language-parser'
import { locales } from 'browser-config'
/**
 * Special api route for redirecting "share" urls to
 * proper locale path
 */
export default async function redirectShare(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const play = req.query?.play as string

  res.status(301)

  if (!play) {
    //go to index
    res.redirect('/')

    return
  }

  const playEncoded = `?play=${encodeURIComponent(play)}`

  let language = parser.pick(locales, req.headers['accept-language'] || '')

  if (!language) {
    // default language
    res.redirect(`/app${playEncoded}`)

    return
  }

  // custom language
  res.redirect(`/${language}/app/${playEncoded}`)
}
