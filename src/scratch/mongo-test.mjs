import pkg from 'mongodb'
const { ObjectId } = pkg

// import { db as dbSettings, isProduction } from 'server-config'
import { connectToDatabase } from './connection.mjs'
const userId = '61649988acf39de641808c96'
async function main() {
  // const result = await bulkSaveToUserCollection(
  //   '61649988acf39de641808c96',
  //   [
  //     { id: 1, date: new Date(1995, 11, 17) },
  //     { id: 1, date: new Date(1998, 11, 17) },
  //     { id: 1, date: new Date(1999, 11, 17) },
  //     { id: 2, date: new Date(1995, 11, 17) },
  //     { id: 3, date: new Date(1996, 11, 17) }
  //   ],
  //   'favorites'
  // )

  // const result = await clearCollection(userId, 'test')
  const result = await bulkSaveStations([
    { _id: 1, date: new Date(1995, 11, 17) },
    { _id: 1, date: new Date(1998, 11, 17) },
    { _id: 1, date: new Date(1999, 11, 17) },
    { _id: 2, date: new Date(1995, 11, 17) },
    { _id: 3, date: new Date(1996, 11, 17) }
  ])
  console.log({ result })
}
main()

//TODO - ovde treba da se prosledi connection, session
async function bulkSaveToUserCollection(userId, stations, collectionName) {
  const { db, client } = await connectToDatabase()

  const session = client.startSession()
  try {
    await session.withTransaction(async () => {
      // const localSession = isProduction ? session : undefined
      //   await saveStation(db, stations, localSession)

      const user = await db.collection('users').findOne({
        _id: new ObjectId(userId)
      })

      let collection
      if (user) {
        //check if recent array exists
        const userCollection = user[collectionName]

        collection =
          typeof userCollection !== 'undefined'
            ? [...userCollection, ...stations]
            : []

        const unique = new Map()
        /* filter unique values , and take most recent date for the station */
        for (const station of collection) {
          const present = unique.get(station.id)

          if (present) {
            //take the latest date
            unique.set(station.id, {
              id: station.id,
              date: present.date > station.date ? present.date : station.date
            })
            continue
          }

          unique.set(station.id, { id: station.id, date: station.date })
        }

        //sort by date  - newest first
        collection = [...unique.values()].sort((a, z) => {
          // @ts-ignore - substracting dates works just fine
          return z.date - a.date
        })

        //limit collection size
        if (collection.length > 100) {
          collection.splice(0, 100)
        }
      } else {
        throw new Error('user not found')
      }

      //save data
      db.collection('users').updateOne(
        {
          _id: new ObjectId(userId)
        },
        {
          $set: { [collectionName]: collection }
        },
        { upsert: true }
      )

      // save actual stations
    })
  } finally {
    session.endSession()
  }
}

export async function clearCollection(userId, arrayName) {
  const { db } = await connectToDatabase()

  //clear data
  db.collection('users').updateOne(
    {
      _id: new ObjectId(userId)
    },
    {
      $set: { [arrayName]: [] }
    },
    { upsert: true }
  )
}

async function bulkSaveStations(stations) {
  const { db } = await connectToDatabase()

  const batch = stations.map((station) => {
    return {
      updateOne: {
        filter: { _id: station._id },
        update: { $set: station },
        upsert: true
      }
    }
  })

  await db.collection('stations').bulkWrite(batch)
}
