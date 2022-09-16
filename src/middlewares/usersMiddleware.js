import mongo from '../db/db.js'

async function userMiddleware(req, res, next) {
  const token = req.headers.authorization.replace('Bearer ', '')

  if (!token) {
    return res.send(400)
  }

  try {
    const session = await mongo.collection('sessions').findOne({ token })

    if (!token) {
      return res.send(401)
    }

    const user = await mongo.collection('users').findOne({
      _id: session.userId
    })

    res.locals.session = session
    res.locals.user = user
    next()
  } catch (error) {
    return res.send(500)
  }
}

export { userMiddleware }
