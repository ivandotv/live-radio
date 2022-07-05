import faker from '@faker-js/faker'
import * as dateFns from 'date-fns'
import { ServerConfig } from 'lib/server/config'
import { connectionFactory } from 'lib/server/db-connection'
import { RadioRepository } from 'lib/server/radio-repository'
import { ObjectId } from 'mongodb'
import { createStations, seedDatabase } from '__tests__/__utils__/db-utils'
import { createTestContainer } from '__tests__/__utils__/test-di-container'

let users: Awaited<ReturnType<typeof seedDatabase>>
let client: MongoClient
let dbName: string

const container = createTestContainer().child()

describe('Radio Repository', () => {
  beforeAll(async () => {
    const config = container.resolve<ServerConfig>('config')

    dbName = config.mongoDb.dbName
    client = await container.resolve<ReturnType<typeof connectionFactory>>(
      connectionFactory
    )()
  })

  beforeEach(async () => {
    //seed the db
    users = await seedDatabase(client, dbName)
  })

  afterEach(async () => {
    //drop the db
    await client.db(dbName).dropDatabase()
  })

  afterAll(async () => {
    //close connection to the database
    await client.close()
  })

  describe('User collection', () => {
    test('get user collection', async () => {
      const repository = container.resolve<RadioRepository>(RadioRepository)

      const result = await repository.getCollection(
        users.userWithFiveStationsInCollection.id,
        'favorites'
      )
      expect(result).toEqual(
        users.userWithFiveStationsInCollection.favorites.map((data) => data._id)
      )
    })

    test('when user collection is empty, return an empty array', async () => {
      const repository = container.resolve<RadioRepository>(RadioRepository)

      const result = await repository.getCollection(
        users.userWithEmptyCollections.id,
        'favorites'
      )
      expect(result).toEqual([])
    })

    test('if the user collection does not exist, return empty array', async () => {
      const repository = container.resolve<RadioRepository>(RadioRepository)

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

      const repository = container.resolve<RadioRepository>(RadioRepository)

      await repository.saveStation(userId, stationId, collection)
      const result = await repository.getCollection(userId, collection)

      expect(result).toEqual([stationId])
      expect(result).toHaveLength(1)
    })

    test('throw error if the user does not exist', async () => {
      const userId = new ObjectId()
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = container.resolve<RadioRepository>(RadioRepository)

      await expect(
        repository.saveStation(userId.toString(), stationId, collection)
      ).rejects.toThrow('user not found')
    })

    test('if the user collection does not exist, create one and add', async () => {
      const userId = users.userWithNoCollections.id
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = container.resolve<RadioRepository>(RadioRepository)

      await repository.saveStation(userId, stationId, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toEqual([stationId])
      expect(result).toHaveLength(1)
    })

    test('new station is addded at index 0', async () => {
      const userId = users.userWithFiveStationsInCollection.id
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = container.resolve<RadioRepository>(RadioRepository)

      await repository.saveStation(userId, stationId, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result[0]).toEqual(stationId)
      expect(result).toHaveLength(
        users.userWithFiveStationsInCollection[collection].length + 1
      )
    })

    test('collection is trimmed to the collection limit', async () => {
      const userId = users.userWithFiveStationsInCollection.id
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'
      const maxCollectionLimit = 3

      const childContainer = createTestContainer(
        {
          mongoDb: {
            maxRadioCollectionLimit: maxCollectionLimit
          }
        },
        undefined,
        container
      )

      const repository =
        childContainer.resolve<RadioRepository>(RadioRepository)

      await repository.saveStation(userId, stationId, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result[0]).toEqual(stationId)
      expect(result).toHaveLength(maxCollectionLimit)
    })
  })

  describe('Delete', () => {
    test('delete user station', async () => {
      const userData = users.userWithFiveStationsInCollection
      const userId = userData.id
      const collection = 'favorites'
      const stationId = userData[collection][0]._id

      const repository = container.resolve<RadioRepository>(RadioRepository)

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
      const userData = users.userWithFiveStationsInCollection
      const userId = new ObjectId().toString()
      const collection = 'favorites'
      const stationId = userData[collection][0]._id

      const repository = container.resolve<RadioRepository>(RadioRepository)

      const result = await repository.deleteStation(
        userId,
        stationId,
        collection
      )

      expect(result).toBe(false)
    })

    test('when collection does not exist, return false', async () => {
      const userData = users.userWithFiveStationsInCollection
      const userId = userData.id
      const collection = 'old_stations'
      const stationId = userData['favorites'][0]._id

      const repository = container.resolve<RadioRepository>(RadioRepository)

      const result = await repository.deleteStation(
        userId,
        stationId,
        collection
      )

      expect(result).toBe(false)
    })

    test('if the station does not exist,return false', async () => {
      const userData = users.userWithFiveStationsInCollection
      const userId = userData.id
      const collection = 'favorites'
      const stationId = faker.datatype.uuid()

      const repository = container.resolve<RadioRepository>(RadioRepository)

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
      const userData = users.userWithFiveStationsInCollection
      const userId = userData.id
      const collection = 'favorites'

      const repository = container.resolve<RadioRepository>(RadioRepository)

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
      const repository = container.resolve<RadioRepository>(RadioRepository)

      const result = await repository.deleteCollection(userId, collection)

      expect(result).toBe(false)
    })

    test('when collection is not found, return false', async () => {
      const userData = users.userWithFiveStationsInCollection
      const userId = userData.id.toString()
      const collection = 'wrong_collection'
      const repository = container.resolve<RadioRepository>(RadioRepository)

      const result = await repository.deleteCollection(userId, collection)

      expect(result).toBe(false)
    })
  })

  describe('Import stations', () => {
    test('import stations', async () => {
      const userData = users.userWithEmptyCollections
      const userId = userData.id
      const collection = 'favorites'
      const stationsToImport = createStations(10).reverse()

      const repository = container.resolve<RadioRepository>(RadioRepository)

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(stationsToImport.length)
    })

    test('add stations to already existing stations,', async () => {
      const userId = users.userWithFiveStationsInCollection.id
      const collection = 'favorites'
      const stationsToImport = createStations(10).reverse()
      const repository = container.resolve<RadioRepository>(RadioRepository)

      await repository.importCollection(userId, stationsToImport, collection)
      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(
        stationsToImport.length +
          users.userWithFiveStationsInCollection[collection].length
      )
    })

    test('throw if the user does not exist', async () => {
      const userId = new ObjectId().toString()
      const collection = 'favorites'
      const stationsToImport = createStations(1)
      const repository = container.resolve<RadioRepository>(RadioRepository)

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
      const childContainer = createTestContainer(
        {
          mongoDb: {
            maxRadioCollectionLimit: maxCollectionLimit
          }
        },
        undefined,
        container
      )
      const repository =
        childContainer.resolve<RadioRepository>(RadioRepository)

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(maxCollectionLimit)
    })

    test('sort the collection by newest station first', async () => {
      const userData = users.userWithFiveStationsInCollection
      const userId = userData.id
      const collection = 'favorites'
      const newStationCount = 5
      const stationsToImport = createStations(
        newStationCount,
        //create stations in the future
        dateFns.add(Date.now(), { years: 10 })
      )
      const repository = container.resolve<RadioRepository>(RadioRepository)
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
      const userData = users.userWithFiveStationsInCollection
      const userId = userData.id
      const collection = 'favorites'
      const stationsToImport = userData[collection].map((data) => ({
        _id: data._id,
        date: new Date()
      }))
      const repository = container.resolve<RadioRepository>(RadioRepository)

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(stationsToImport.length)
      expect(result).toEqual(stationsToImport.map((data) => data._id))
    })

    test('if collection does not exist, it is created', async () => {
      const userData = users.userWithNoCollections
      const userId = userData.id.toString()
      const collection = 'favorites'
      const stationsToImport = createStations(5)
      const repository = container.resolve<RadioRepository>(RadioRepository)
      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(stationsToImport.length)
      expect(result).toEqual(stationsToImport.map((data) => data._id))
    })
  })
})
