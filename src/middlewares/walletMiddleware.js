import { walletSchema } from '../schemas/walletSchemas.js'

const TRANSACTIONS_TYPE = Object.freeze({
  DEBIT: 'debit',
  CREDIT: 'credit'
})

function walletMiddleware(req, res, next) {
  const { description, value, type } = req.body

  const valid = walletSchema.validate({
    description,
    value,
    type
  })

  if (valid.error) {
    return res.send(401)
  }

  if (
    type.toLowerCase() !== TRANSACTIONS_TYPE.CREDIT &&
    type.toLowerCase() !== TRANSACTIONS_TYPE.DEBIT
  ) {
    return res.send(401)
  }

  next()
}

export { walletMiddleware }
