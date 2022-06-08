import { faker } from '@faker-js/faker'
import * as dateFns from 'date-fns'
import { ServerConfig } from 'lib/server/config'
import { RadioRepository } from 'lib/server/radio-repository'
import { PumpIt } from 'pumpit'

export function resolveRepository(
  parentContainer: PumpIt,
  maxCollectionLimit?: number
) {
  const config = parentContainer.resolve<ServerConfig>('config')

  maxCollectionLimit =
    maxCollectionLimit ?? config.mongoDb.maxRadioCollectionLimit

  return parentContainer
    .child()
    .bindFactory('config', () => {
      const mongoConfig: Partial<ServerConfig['mongoDb']> = {
        maxRadioCollectionLimit: maxCollectionLimit!
      }

      return {
        ...config,
        mongoDb: {
          ...config.mongoDb,
          ...mongoConfig
        }
      }
    })
    .resolve<RadioRepository>(RadioRepository)
}

export function createStations(count = 0, startDate = new Date()) {
  let i = 1

  return Array.from({ length: count }).map(() => {
    return {
      _id: faker.datatype.uuid(),
      date: dateFns.sub(startDate, { months: i++ })
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
