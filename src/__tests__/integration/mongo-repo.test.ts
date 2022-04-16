// import { connectToMongoTestDb, seedMongoUsers } from './utils/mongo-test-utils'

// let connection: MongoConnection

describe('Mongo Repository test', () => {
  beforeAll(async () => {
    // connection = await connectToMongoTestDb()
  })

  beforeEach(async () => {
    // await seedMongoUsers(connection)
  })
  afterEach(async () => {
    //drop db
    // await connection.db.dropDatabase()
  })

  afterAll(() => {
    //close connection to the database
    // connection.client.close()
  })
})

export {}
