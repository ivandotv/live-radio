import faker from '@faker-js/faker'
import * as dateFns from 'date-fns'
import { RadioRepository } from 'lib/server/radio-repository'
import { ObjectId } from 'mongodb'
import {
  connectToMongoTestDb,
  createStations,
  seedDatabase
} from './utils/db-utils'

let connection: { client: MongoClient; dbName: string }
let users: Awaited<ReturnType<typeof seedDatabase>>

function createRepository(
  opts?: ConstructorParameters<typeof RadioRepository>[2]
) {
  opts = { ...{ maxCollectionLimit: 100 }, ...opts }

  return new RadioRepository(connection.client, connection.dbName, opts)
}

describe('Radio Repository', () => {
  beforeAll(async () => {
    connection = await connectToMongoTestDb()
  })

  beforeEach(async () => {
    //seed the db
    users = await seedDatabase(connection.client, connection.dbName)
  })

  afterEach(async () => {
    //drop the db
    await connection.client.db(connection.dbName).dropDatabase()
  })

  afterAll(async () => {
    //close connection to the database
    await connection.client.close()
  })

  describe('User collection', () => {
    test('get user collection', async () => {
      const repository = createRepository()

      const result = await repository.getCollection(
        users.userWithFiveStationsInCollections.id,
        'favorites'
      )
      expect(result).toEqual(
        users.userWithFiveStationsInCollections.favorites.map(
          (data) => data._id
        )
      )
    })

    test('when user collection is empty, return an empty array', async () => {
      const repository = createRepository()

      const result = await repository.getCollection(
        users.userWithEmptyCollections.id,
        'favorites'
      )
      expect(result).toEqual([])
    })

    test('if the user collection does not exist, return empty array', async () => {
      const repository = createRepository()

      const result = await repository.getCollection(
        users.userWithNoCollections.id,
        'favorites'
      )
      expect(result).toEqual([])
    })
  })

  describe('Save station', () => {
    test('save to user collection', async () => {
      const userId = users.userWithEmptyCollections.id
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = createRepository()

      await repository.saveStation(userId, stationId, collection)
      const result = await repository.getCollection(userId, collection)

      expect(result).toEqual([stationId])
      expect(result).toHaveLength(1)
    })

    test('throw error if the user does not exist', async () => {
      const userId = new ObjectId()
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = createRepository()

      await expect(
        repository.saveStation(userId.toString(), stationId, collection)
      ).rejects.toThrow('user not found')
    })

    test('if the user collection does not exist, create one and add', async () => {
      const userId = users.userWithNoCollections.id
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = createRepository()

      await repository.saveStation(userId, stationId, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toEqual([stationId])
      expect(result).toHaveLength(1)
    })

    test('new station is addded at index 0', async () => {
      const userId = users.userWithFiveStationsInCollections.id
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = createRepository()

      await repository.saveStation(userId, stationId, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result[0]).toEqual(stationId)
      expect(result).toHaveLength(
        users.userWithFiveStationsInCollections[collection].length + 1
      )
    })

    test('collection is trimmed to the collection limit', async () => {
      const userId = users.userWithFiveStationsInCollections.id
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'
      const maxCollectionLimit = 3

      const repository = createRepository({ maxCollectionLimit })

      await repository.saveStation(userId, stationId, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result[0]).toEqual(stationId)
      expect(result).toHaveLength(maxCollectionLimit)
    })
  })

  describe('Delete', () => {
    test('delete user station', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'favorites'
      const stationId = userData[collection][0]._id

      const repository = createRepository()

      const result = await repository.deleteStation(
        userId,
        stationId,
        collection
      )

      const returnedCollection = await repository.getCollection(
        userId,
        collection
      )

      expect(returnedCollection.filter((id) => stationId == id).length).toBe(0)
      expect(returnedCollection).toHaveLength(userData[collection].length - 1)
      expect(result).toBe(true)
    })

    test('when user does not exist return false', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = new ObjectId().toString()
      const collection = 'favorites'
      const stationId = userData[collection][0]._id

      const repository = createRepository()

      const result = await repository.deleteStation(
        userId,
        stationId,
        collection
      )

      expect(result).toBe(false)
    })

    test('when collection does not exist, return false', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'old_stations'
      const stationId = userData['favorites'][0]._id

      const repository = createRepository()

      const result = await repository.deleteStation(
        userId,
        stationId,
        // @ts-expect-error - wrong collection
        collection
      )

      expect(result).toBe(false)
    })

    test('if the station does not exist,return false', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'favorites'
      const stationId = faker.datatype.uuid()

      const repository = createRepository()

      const result = await repository.deleteStation(
        userId,
        stationId,
        collection
      )

      expect(result).toBe(false)
    })
  })
  describe('Delete user collection', () => {
    test('elete collection', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'favorites'

      const repository = createRepository()

      const result = await repository.deleteCollection(userId, collection)

      const returnedCollection = await repository.getCollection(
        userId,
        collection
      )

      expect(result).toBe(true)
      expect(returnedCollection).toHaveLength(0)
    })

    test('when user is not found, return false', async () => {
      const userId = new ObjectId().toString()
      const collection = 'favorites'

      const repository = createRepository()

      const result = await repository.deleteCollection(userId, collection)

      expect(result).toBe(false)
    })

    test('when collection is not found, return false', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'wrong_collection'

      const repository = createRepository()

      // @ts-expect-error - wrong collection
      const result = await repository.deleteCollection(userId, collection)

      expect(result).toBe(false)
    })
  })

  describe('Import stations', () => {
    test('import stations successfuly', async () => {
      const userData = users.userWithEmptyCollections
      const userId = userData.id
      const collection = 'favorites'

      const stationsToImport = createStations(10).reverse()

      const repository = createRepository()

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(stationsToImport.length)
    })

    test('add stations to already existing stations,', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'favorites'

      const stationsToImport = createStations(10).reverse()

      const repository = createRepository()

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(
        stationsToImport.length +
          users.userWithFiveStationsInCollections[collection].length
      )
    })

    test('throw if the user does not exist', async () => {
      const userId = new ObjectId().toString()
      const collection = 'favorites'

      const stationsToImport = createStations(1)

      const repository = createRepository()

      await expect(
        repository.importCollection(userId, stationsToImport, collection)
      ).rejects.toThrowError(/user not found/i)
    })

    test('limit imported collection', async () => {
      const userData = users.userWithEmptyCollections
      const userId = userData.id
      const collection = 'favorites'
      const maxCollectionLimit = 10

      const stationsToImport = createStations(50)

      const repository = createRepository({ maxCollectionLimit })

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(maxCollectionLimit)
    })

    test('sort the collection by newest station first', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'favorites'
      const newStationCount = 5

      const stationsToImport = createStations(
        newStationCount,
        //create stations in the future
        dateFns.add(Date.now(), { years: 10 })
      )

      const repository = createRepository()

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result.slice(0, newStationCount)).toEqual(
        stationsToImport.map((station) => station._id)
      )

      expect(result.slice(userData[collection].length * -1)).toEqual(
        userData[collection].map((station) => station._id)
      )
    })

    test('duplicate stations are removed', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'favorites'

      const stationsToImport = userData[collection].map((data) => ({
        _id: data._id,
        date: new Date()
      }))

      const repository = createRepository()

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(stationsToImport.length)
      expect(result).toEqual(stationsToImport.map((data) => data._id))
    })

    test('if collection does not exist, it is created', async () => {
      const userData = users.userWithNoCollections
      const userId = userData.id
      const collection = 'favorites'

      const stationsToImport = createStations(5)

      const repository = createRepository()

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(stationsToImport.length)
      expect(result).toEqual(stationsToImport.map((data) => data._id))
    })
  })
})
