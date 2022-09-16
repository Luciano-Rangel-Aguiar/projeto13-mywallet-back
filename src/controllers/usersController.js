import bcrypt from 'bcrypt'
import mongo from '../db/db.js'
import { v4 as uuid } from 'uuid'
import { signUpSchema, loginSchema } from '../schemas/userSchemas.js'

async function signUp(req, res) {
  const { name, email, password } = req.body

  const valid = signUpSchema.validate({
    name,
    email,
    password
  })

  if (valid.error) {
    return res.send(400)
  }

  const encrypt = bcrypt.hashSync(password, 12)

  try {
    await mongo.collection('users').insertOne({
      name,
      email,
      password: encrypt
    })

    return res.send(201)
  } catch (error) {
    console.error(error)
    return res.send(500)
  }
}

async function login(req, res) {
  const { email, password } = req.body

  const valid = loginSchema.validate({
    email,
    password
  })

  if (valid.error) {
    return res.send(400)
  }

  try {
    const user = await mongo.collection('users').findOne({
      email
    })

    const validPassword = bcrypt.compareSync(password, user.password)

    if (!user || !validPassword) {
      return res.send(401)
    }

    const token = uuid()

    mongo.collection('sessions').insertOne({
      userId: user._id,
      token
    })
    
    return res.send({token: token,username :user.name})
  } catch (error) {
    console.error(error)
    return res.send(500)
  }
}

export { signUp, login }
