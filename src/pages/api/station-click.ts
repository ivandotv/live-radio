import { withLogger } from 'lib/server/logger'
import { withErrorLogging } from 'lib/server/utils'
import { radioAPIUserAgent } from 'lib/shared/config'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
/**
 * Sends station click to radio browser api.
 */
const handler = async function sendStationClick(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const payload = req.body.id

    const radioApi = new RadioBrowserApi(radioAPIUserAgent)

    await radioApi.sendStationClick(payload)

    res.status(200).json({ msg: 'ok' })
  } catch (e: unknown) {
    res.status(503).json({ msg: 'fail' })
  }
}

export default withErrorLogging(withLogger(handler))
