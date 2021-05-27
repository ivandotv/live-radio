import { NextApiRequest, NextApiResponse } from 'next'
import parser from 'accept-language-parser'
import getConfig from 'next/config'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const config = getConfig()
  const play = req.query?.play as string

  if (!play) {
    //go to index
    res.redirect('/')

    return
  }

  const playEncoded = `?play=${encodeURIComponent(play)}`

  let language = parser.pick(
    config.serverRuntimeConfig.locales,
    req.headers['accept-language'] || ''
  )

  if (!language) {
    // default language
    res.redirect(`/app${playEncoded}`)

    return
  }

  // custom language
  res.redirect(`/${language}/app/${playEncoded}`)
}
