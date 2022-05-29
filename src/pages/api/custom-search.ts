import { SERVER_CONFIG } from 'lib/server/config'
import { withLogger } from 'lib/server/logger'
import { withErrorLogging } from 'lib/server/utils'
import { SHARED_CONFIG } from 'lib/shared/config'
import { dataToRadioDTO } from 'lib/shared/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
/**
 * Custom search for stations
 */
const handler = async function customSearch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const name = req.body.name || ''

    const radioApi = new RadioBrowserApi(SHARED_CONFIG.radioAPIUserAgent)

    const result = await radioApi.searchStations(
      {
        name,
        limit: SERVER_CONFIG.customSearchStationLimit
      },
      undefined,
      true
    )

    const stations = dataToRadioDTO(result)

    res.status(200).json({ stations })
  } catch (e: unknown) {
    res.status(503).json({ msg: 'radio api error' })
  }
}

export default withErrorLogging(withLogger(handler))
