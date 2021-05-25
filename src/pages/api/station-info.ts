import { userAgentName } from 'app-config'
import { dataToRadioStations } from 'lib/station-utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new RadioBrowserApi(fetch, userAgentName)

  try {
    const stationId = req.query.play as string
    const stationResponse = await api.getStationsById([stationId])

    res.status(200).json(dataToRadioStations(stationResponse))
  } catch (err) {
    res.status(503).json({ message: err.message ?? 'server error' })
  }
}
