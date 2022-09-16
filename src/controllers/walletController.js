import mongo from '../db/db.js'

const TRANSACTIONS_TYPE = Object.freeze({
  DEBIT: 'debit',
  CREDIT: 'credit'
})

async function insert(req, res) {
  const { description, value, type } = req.body

  const { user } = res.locals

  try {
    mongo.collection('wallet').insertOne({
      description,
      value,
      type,
      userId: user._id,
      date: +new Date()
    })

    return res.send(201)
  } catch (error) {
    console.log(error)
    return res.send(500)
  }
}

async function list(req, res) {
  const { user } = res.locals

  try {
    const transactions = await mongo
      .collection('wallet')
      .find({
        userId: user._id
      })
      .toArray()

    const total = transactions.reduce((acc, curr) => {
      if (curr.type === TRANSACTIONS_TYPE.DEBIT) {
        return acc - curr.value
      }
      return acc + curr.value
    }, 0)

    /*     transactions.push({
      type: 'total',
      value: total
    }) */

    return res.send(transactions)
  } catch (error) {
    console.log(error)
    return res.send(400)
  }
}

export { insert, list }
