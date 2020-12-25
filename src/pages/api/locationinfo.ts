import { countryDataByKey } from 'lib/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(requestIp.getClientIp(req))
  const detectedIp = requestIp.getClientIp(req)

  // if localhost is detected , send empty string
  const queryIp = detectedIp === '::1' ? '' : detectedIp

  try {
    const response = await fetch(`http://ip-api.com/json/${queryIp}`)
    const { country } = await response.json()

    const countryData = countryDataByKey('name', country)

    if (!countryData) {
      throw new Error(`Can't parse location data`)
    }

    res.status(200).json(countryData)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error locating IP'
    res.status(503).json({ message })
  }
}
