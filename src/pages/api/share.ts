import { NextApiRequest, NextApiResponse } from 'next'
import parser from 'accept-language-parser'
import { locales } from 'app-config'

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
