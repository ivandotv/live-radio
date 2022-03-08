import { userAgentName } from 'browser-config'
import { dataToRadioDTO } from 'lib/utils/station-utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'

/**
 * Gets station info from radio browser api
 */
export default async function getStationInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const api = new RadioBrowserApi(userAgentName)

  try {
    const stationId = req.query.play as string
    const stationResponse = await api.getStationsById([stationId])
    const stations = dataToRadioDTO(stationResponse)

    if (stations.length) {
      res.status(200).json(stations)
    } else {
      res.status(404).json({ msg: 'not found' })
    }
  } catch (err: any) {
    res.status(503).json({ msg: err.message ?? 'server error' })
  }
}
