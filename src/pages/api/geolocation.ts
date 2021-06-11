import { isProduction } from 'app-config'
import { countryDataByKey } from 'lib/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetchJson } from 'nice-fetch'
import requestIp from 'request-ip'

/**
 * Determine country via ip address
 *  */
export default async function getGeoLocation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const detectedIp = requestIp.getClientIp(req)

  // if localhost is detected , send empty string
  let queryIp =
    detectedIp === '::1' || detectedIp === '127.0.0.1' ? '' : detectedIp

  try {
    const [data] = await fetchJson(`http://ip-api.com/json/${queryIp}`)
    console.log(data)
    const countryData = countryDataByKey('code', data.countryCode)

    if (!countryData) {
      throw new Error(`Can't parse location data`)
    }

    res.status(200).json(countryData)
  } catch (err: any) {
    const message = err.message ? err.message : 'Error locating IP'
    res
      .status(503)
      .json({ message, debug: isProduction ? undefined : err.toString() })
  }
}
