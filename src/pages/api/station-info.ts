import { userAgentName } from 'app-config'
import { dataToRadioStations } from 'lib/station-utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new RadioBrowserApi(userAgentName)

  try {
    const stationId = req.query.play as string
    const stationResponse = await api.getStationsById([stationId])
    const stations = dataToRadioStations(stationResponse)

    console.log('stations length ', stations.length)

    if (stations.length) {
      res.status(200).json(stations)
    } else {
      res.status(404).json({ msg: 'not found' })
    }
  } catch (err) {
    res.status(503).json({ msg: err.message ?? 'server error' })
  }
}
