import { userAgentName } from 'app-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payload = req.body.id

    const radioApi = new RadioBrowserApi(userAgentName, true)

    const response = await radioApi.sendStationClick(payload)
    console.log(response)

    res.status(200).json({ msg: 'ok' })
  } catch (e: unknown) {
    res.status(503).json({ msg: 'fail' })
  }
}
