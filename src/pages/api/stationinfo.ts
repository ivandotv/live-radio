import { userAgentName } from 'lib/appSettings'
import { stationsToRadioStations } from 'lib/stationUtils'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new RadioBrowserApi(fetch, userAgentName)

  try {
    const stationId = req.query.play as string
    const stationResponse = await api.getStationsById([stationId])

    res.status(200).json(stationsToRadioStations(stationResponse))
  } catch (err) {
    res.status(503).json({ message: err.message ?? 'server error' })
  }
}
