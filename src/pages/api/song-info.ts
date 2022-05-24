import { withLogger } from 'lib/server/logger'
import { logServerError, withErrorLogging } from 'lib/server/utils'
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-expect-error - no types for module
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
export const handler = (getStationInfo: typeof getStationInfoAsync) =>
  async function getSongInfo(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.station) {
      res.status(400).json({ msg: 'station url missing' })

      return
    }
    try {
      const response: { title: string } = await getStationInfo(
        req.query.station,
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
    } catch (err: any) {
      logServerError(
        err,
        {
          tags: {
            endpoint: 'song-info'
          }
        },
        req.url
      )
      res.status(503).json({ msg: 'server error' })
    }
  }

export default withErrorLogging(withLogger(handler(getStationInfoAsync)))
