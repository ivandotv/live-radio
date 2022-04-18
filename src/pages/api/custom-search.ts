import { customSearchStationLimit } from 'lib/server/config'
import { withErrorLogging } from 'lib/server/utils'
import { radioAPIUserAgent } from 'lib/shared/config'
import { dataToRadioDTO } from 'lib/shared/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
/**
 * Custom search for stations
 */
const handler = async function sendStationClick(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const name = req.body.name || ''

    const radioApi = new RadioBrowserApi(radioAPIUserAgent)

    const result = await radioApi.searchStations(
      {
        name,
        limit: customSearchStationLimit
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

export default withErrorLogging(handler)
