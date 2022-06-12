import { faker } from '@faker-js/faker'
import * as dateFns from 'date-fns'
import { ObjectId } from 'mongodb'

export function createStations(count = 0, startDate = new Date()) {
  const stations = []

  for (let i = 1; i <= count; i++) {
    stations.push({
      _id: faker.datatype.uuid(),
      date: dateFns.sub(startDate, { months: i })
    })
  }

  return stations
}

export function createUserData(recentCount = 0, favoritesCount = 0) {
  const id = new ObjectId()

  return {
    _id: id,
    id: id.toString(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
    emailVerified: null,
    recent: createStations(recentCount),
    favorites: createStations(favoritesCount)
  }
}

export async function seedDatabase(client: MongoClient, dbName: string) {
  const db = client.db(dbName)

  const userWithEmptyCollections = createUserData()
  const userWithFiveStationsInCollection = createUserData(5, 5)
  const userWithNoCollections = createUserData()

  await db
    .collection('users')
    .insertMany([
      userWithEmptyCollections,
      userWithFiveStationsInCollection,
      userWithNoCollections
    ])

  return {
    userWithEmptyCollections,
    userWithFiveStationsInCollection,
    userWithNoCollections
  }
}
