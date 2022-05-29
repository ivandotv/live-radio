import { withLogger } from 'lib/server/logger'
import { withErrorLogging } from 'lib/server/utils'
import { SHARED_CONFIG } from 'lib/shared/config'
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

    const radioApi = new RadioBrowserApi(SHARED_CONFIG.radioAPIUserAgent)

    await radioApi.voteForStation(payload)

    res.status(200).json({ msg: 'ok' })
  } catch (e: unknown) {
    res.status(503).json({ msg: 'fail' })
  }
}

export default withErrorLogging(withLogger(handler))
