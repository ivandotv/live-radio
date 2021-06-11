import { getLastPlayed, onError, onNoMatch } from 'lib/api/api-utils'
import { setupSession } from 'lib/api/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

/* Get last played station for the user */
const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(setupSession)
  .get(getLastPlayed)

export default handler

// export default function lastPlayed(req: any, _res: any) {
//   console.log('last played')
//   console.log(req)
// }
