import faker from '@faker-js/faker'
import * as dateFns from 'date-fns'
import { ServerConfig, SERVER_CONFIG } from 'lib/server/config'
import { getDbConnection } from 'lib/server/db-connection'
import { getServerContainer } from 'lib/server/injection-root'
import { ObjectId } from 'mongodb'
import { SCOPE } from 'pumpit'
import {
  createStations,
  resolveRepository,
  seedDatabase
} from './utils/db-utils'

let users: Awaited<ReturnType<typeof seedDatabase>>
let client: MongoClient
let dbName: string

/** PRACTICE: create child container from original container*/
const container = getServerContainer()
const originalconfig = container.resolve<typeof SERVER_CONFIG>('config')

const childContainer = container.child().bindFactory(
  'config',
  () => {
    const mongoConfig: Partial<ServerConfig['mongoDb']> = {
      dbName: `test_db_${process.env.JEST_WORKER_ID}`
    }

    return {
      ...originalconfig,
      configName: 'child',
      mongoDb: {
        ...originalconfig.mongoDb,
        ...mongoConfig
      }
    }
  },
  { scope: SCOPE.CONTAINER_SINGLETON }
)

describe('Radio Repository', () => {
  beforeAll(async () => {
    const config = childContainer.resolve<typeof SERVER_CONFIG>('config')

    dbName = config.mongoDb.dbName
    client = await childContainer.resolve<ReturnType<typeof getDbConnection>>(
      getDbConnection
    )
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
      const repository = resolveRepository(childContainer)

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
      const repository = resolveRepository(childContainer)

      const result = await repository.getCollection(
        users.userWithEmptyCollections.id,
        'favorites'
      )
      expect(result).toEqual([])
    })

    test('if the user collection does not exist, return empty array', async () => {
      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

      await repository.saveStation(userId, stationId, collection)
      const result = await repository.getCollection(userId, collection)

      expect(result).toEqual([stationId])
      expect(result).toHaveLength(1)
    })

    test('throw error if the user does not exist', async () => {
      const userId = new ObjectId()
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = resolveRepository(childContainer)

      await expect(
        repository.saveStation(userId.toString(), stationId, collection)
      ).rejects.toThrow('user not found')
    })

    test('if the user collection does not exist, create one and add', async () => {
      const userId = users.userWithNoCollections.id
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = resolveRepository(childContainer)

      await repository.saveStation(userId, stationId, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toEqual([stationId])
      expect(result).toHaveLength(1)
    })

    test('new station is addded at index 0', async () => {
      const userId = users.userWithFiveStationsInCollections.id
      const stationId = faker.datatype.uuid()
      const collection = 'favorites'

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer, maxCollectionLimit)

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

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

      const result = await repository.deleteCollection(userId, collection)

      expect(result).toBe(false)
    })

    test('when collection is not found, return false', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'wrong_collection'

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(stationsToImport.length)
    })

    test('add stations to already existing stations,', async () => {
      const userData = users.userWithFiveStationsInCollections
      const userId = userData.id
      const collection = 'favorites'

      const stationsToImport = createStations(10).reverse()

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer, maxCollectionLimit)

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

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

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

      const repository = resolveRepository(childContainer)

      await repository.importCollection(userId, stationsToImport, collection)

      const result = await repository.getCollection(userId, collection)

      expect(result).toHaveLength(stationsToImport.length)
      expect(result).toEqual(stationsToImport.map((data) => data._id))
    })
  })
})
