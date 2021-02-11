import { isProduction } from 'app-confg'
import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestWithSession } from './middleware'
import { connectToDatabase } from './mongodb'

export type DBCollections = 'favorites' | 'recent'

export function onError(err: any, req: NextApiRequest, res: NextApiResponse) {
  console.log(err)
  res.status(500).json({
    msg: 'Internal Server Error',
    debug: isProduction ? undefined : err.toString()
  })
}

export function onNoMatch(req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({
    msg: 'Resource not found',
    debug: isProduction
      ? undefined
      : {
          url: req.url,
          query: req.query,
          method: req.method,
          headers: req.headers
        }
  })
}

export function getStations(collection: 'favorites' | 'recent') {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const { db } = await connectToDatabase()

    const user = await db
      .collection('users')
      .findOne(
        { _id: new ObjectId(req.session.user.id) },
        { projection: { [collection]: 1 } }
      )

    if (!user) {
      return res.status(401).json({ msg: 'Not authorized' })
    }

    let stations = []
    if (user[collection]) {
      let query = [
        { $match: { _id: { $in: user[collection] } } },
        {
          $addFields: {
            id: '$_id',
            __order: { $indexOfArray: [user[collection], '$_id'] }
          }
        },
        { $sort: { __order: -1 } },
        { $project: { _id: 0, __order: 0 } }
      ]

      const cursor = db.collection('stations').aggregate(query)

      stations = await cursor.toArray()
      await cursor.close() //no need to wait
    }

    return res.json(stations)
  }
}

export function saveStation(collection: DBCollections) {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const { db, client } = await connectToDatabase()
    const { id: stationId } = req.body
    delete req.body.id

    const session = client.startSession()
    try {
      await session.withTransaction(async () => {
        await db
          .collection('stations')
          .updateOne({ _id: stationId }, { $set: req.body }, { upsert: true })
      })
      await db.collection('users').updateOne(
        {
          _id: new ObjectId(req.session.user.id),
          [collection]: { $ne: stationId }
        },
        { $push: { [collection]: stationId } }
      )
    } finally {
      session.endSession()
    }

    return res.status(201).json({ msg: 'Saved' })
  }
}

export function deleteStation(collection: DBCollections) {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const { db } = await connectToDatabase()

    console.log({ body: req.body })
    // const id = JSON.parse(req.body.id)
    const { id } = req.body

    if (!id) {
      return res.status(400).json({ msg: 'Station ID expected' })
    }

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(req.session.user.id) },
        { $pull: { [collection]: id } }
      )

    return res.status(200).json({ msg: 'Deleted' })
  }
}
