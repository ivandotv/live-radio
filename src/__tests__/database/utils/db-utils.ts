import { faker } from '@faker-js/faker'
import { getDbConnection } from 'lib/server/db-connection'
import * as dateFns from 'date-fns'

export async function connectToMongoTestDb(dbName?: string) {
  const workerId = process.env.JEST_WORKER_ID!

  dbName = dbName || `test_db_${workerId}`

  const port = process.env.MONGO_PORT
  const uri = `mongodb://localhost:${port}`

  const client = await getDbConnection(uri)

  return { client, dbName }
}

export function createStations(count = 0, startDate = new Date()) {
  let i = 0

  return Array.from({ length: count }).map(() => {
    i++

    return {
      _id: faker.datatype.uuid(),
      date: dateFns.sub(startDate, { months: i })
    }
  })
}

export function createUserData(recent = 0, favorites = 0) {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
    emailVerified: null,
    recent: createStations(recent),
    favorites: createStations(favorites)
  }
}

export async function seedDatabase(client: MongoClient, dbName: string) {
  const db = client.db(dbName)

  const userOne = createUserData()
  const userTwo = createUserData(5, 5)
  const userThree = createUserData()

  const users = await db
    .collection('users')
    .insertMany([userOne, userTwo, userThree])

  return {
    userWithNoCollections: {
      id: users.insertedIds[2].toString(),
      ...userThree,
      favorites: undefined,
      recent: undefined
    },

    userWithEmptyCollections: {
      id: users.insertedIds[0].toString(),
      ...userOne
    },
    userWithFiveStationsInCollections: {
      id: users.insertedIds[1].toString(),
      ...userTwo
    }
  }
}
