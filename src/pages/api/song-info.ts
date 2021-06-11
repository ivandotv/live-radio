import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { getStationInfo, StreamSource } from 'node-internet-radio'
import { promisify } from 'util'

// promisify the function
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

/**
 * Return currently playing artist and song title for a given url
 *  */
export default async function getSongInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body.url) {
    res.status(400).json({ msg: 'station url missing' })
  }
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
    res.status(503).json({ msg: err.message ?? 'server error' })
  }
}
