import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { getStationInfo, StreamSource } from 'node-internet-radio'
import { promisify } from 'util'

getStationInfo[promisify.custom] = (url: string, stream: string) => {
  return new Promise((resolve, reject) => {
    getStationInfo(
      url,
      (error: Error, data: any) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      },
      stream
    )
  })
}

const getStationInfoAsync = promisify(getStationInfo)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response: { title: string } = await getStationInfoAsync(
      req.body.url,
      StreamSource.STREAM
    )
    const songData = response.title.split('-')
    if (songData.length > 1) {
      res.status(200).json({
        artist: songData[0].trim(),
        title: songData[1].trim()
      })
    } else {
      res.status(200).json({})
    }
  } catch (err) {
    res.status(503).json({ message: err.message ?? 'server error' })
  }
}
