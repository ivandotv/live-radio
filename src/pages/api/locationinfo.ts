import { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(requestIp.getClientIp(req))
  const detectedIp = requestIp.getClientIp(req)

  // if localhost is detected , send empty
  const queryIp = detectedIp === '::1' ? '' : detectedIp

  try {
    const response = await fetch(`http://ip-api.com/json/${queryIp}`)
    const data = await response.json()

    console.log('data')
    console.log(data)
    res.status(200).json({ country: data.country })
  } catch (e) {
    console.log('error data')
    res.status(503).json({ message: 'Error locating IP' })
  }
}
