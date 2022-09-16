import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { signUp, login } from './src/controllers/usersController.js'
import { insert, list } from './src/controllers/walletController.js'
import { userMiddleware } from './src/middlewares/usersMiddleware.js'
import { walletMiddleware } from './src/middlewares/walletMiddleware.js'
dotenv.config()

const server = express()
server.use(cors())
server.use(express.json())

server.post('/signUp', signUp)
server.post('/login', login)
server.post('/insert', userMiddleware, walletMiddleware, insert)
server.get('/wallet', userMiddleware, list)

server.get('/status', (req, res) => {
  return res.send('ok')
})

server.listen(process.env.API, () => {
  console.log(`listen on port ${process.env.API}`)
})
