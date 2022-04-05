import { withErrorLogging } from 'lib/api/api-utils'
import { logger, withLogger } from 'lib/logger-server'
import { countryDataByKey } from 'lib/utils/misc-utils'
import { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'
import { isProduction } from 'server-config'

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
    logger.info('GEO before')
    const response = await fetch(`http://ip-api.com/json/${queryIp}`)
    logger.info('GEO after')

    let data: { countryCode: string }
    let countryData
    if (response.ok) {
      data = (await response.json()) as unknown as { countryCode: string }
      countryData = countryDataByKey('code', data.countryCode)
    }

    logger.info('GEO after 2')
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
export default withErrorLogging(withLogger(handler))
