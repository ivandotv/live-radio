import {
  deleteStation,
  getStations,
  onError,
  onNoMatch,
  saveStation
} from 'lib/api/api-utils'
import { setupSession, validateStation } from 'lib/api/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const collectionName = 'favorites'
const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .get(setupSession, getStations(collectionName))
  .post(setupSession, validateStation, saveStation(collectionName))
  .delete(setupSession, deleteStation(collectionName))

export default handler
