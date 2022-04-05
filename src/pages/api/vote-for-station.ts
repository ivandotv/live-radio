import { userAgentName } from 'browser-config'
import { withErrorLogging } from 'lib/api/api-utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'

/**
 * Vote for station via radio browser api
 */
const handler = async function voteForStation(
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

export default withErrorLogging(handler)
