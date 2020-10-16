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
  // const url = 'http://ice1.somafm.com/groovesalad-256-mp3dad'
  try {
    const response: { title: string } = await getStationInfoAsync(
      req.body.url,
      // url,
      StreamSource.STREAM
    )
    const songData = response.title.split('-')
    // res.status(500).json({ messae: 'error parsing title data' })
    // } //   title:data.title //   stat // const response = { // const tite
    if (songData.length > 1) {
      res.status(200).json({
        artist: songData[0].trim(),
        title: songData[1].trim()
      })
    } else {
      res.status(501).json({ message: 'error parsing song data' })
    }
  } catch (err) {
    res.status(503).json({ message: err.message ?? 'server error' })
  }
  // console.log(req.body)
}
