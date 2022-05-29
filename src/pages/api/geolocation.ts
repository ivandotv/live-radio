import { withLogger } from 'lib/server/logger'
import { SERVER_CONFIG } from 'lib/server/config'
import { countryDataByKey, withErrorLogging } from 'lib/server/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'

/**
 * Determine country via ip address
 *  */
const handler = async function getGeoLocation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const detectedIp = requestIp.getClientIp(req)

  // if localhost is detected , send empty string
  const queryIp =
    detectedIp === '::1' || detectedIp === '127.0.0.1' ? '' : detectedIp

  try {
    const response = await fetch(`http://ip-api.com/json/${queryIp}`)

    let data: { countryCode: string }
    let countryData
    if (response.ok) {
      data = (await response.json()) as unknown as { countryCode: string }
      countryData = countryDataByKey('code', data.countryCode)
    }

    if (!countryData) {
      throw new Error(`Can't parse location data`)
    }

    res.status(200).json(countryData)
  } catch (err: any) {
    const message = err.message ? err.message : 'Error locating IP'
    res.status(503).json({
      message,
      debug: SERVER_CONFIG.isProduction ? undefined : err.toString()
    })
  }
}
export default withErrorLogging(withLogger(handler))
