import { userAgentName } from 'app-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'

/**
 * Sends station click to radio browser api.
 */
export default async function sendStationClick(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const payload = req.body.id

    const radioApi = new RadioBrowserApi(userAgentName)

    const response = await radioApi.sendStationClick(payload)
    console.log(response)

    res.status(200).json({ msg: 'ok' })
  } catch (e: unknown) {
    res.status(503).json({ msg: 'fail' })
  }
}
