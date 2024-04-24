import express from 'express'
import authRoutes from './auth/auth-router.js'
import tasksRouter from './tasks/tasks-router.js'
import setUpMiddlewares from './tools/middlewares.js'

const app = express()

const PORT = process.env.PORT ?? 0

setUpMiddlewares(app)

app.get('/', (_req, res) => {
  res.send('hello world')
})

app.use('/', authRoutes)

app.use('/tasks', tasksRouter)

const server = app.listen(PORT, () => {
})

export { app, server }
