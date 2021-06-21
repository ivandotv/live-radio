import { userAgentName } from 'app-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'

/**
 * Vote for station via radio browser api
 */
export default async function voteForStation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const payload = req.body.id

    const radioApi = new RadioBrowserApi(userAgentName)

    await radioApi.voteForStation(payload)

    res.status(200).json({ msg: 'ok' })
  } catch (e: unknown) {
    res.status(503).json({ msg: 'fail' })
  }
}
