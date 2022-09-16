import { MongoClient } from 'mongodb'


let db
const mongoClient = new MongoClient('mongodb://localhost:27017')

try {
  await mongoClient.connect()
} catch (error) {
  console.log(error)
}

db = mongoClient.db('mywallet')

export default db
