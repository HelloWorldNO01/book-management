import app from './app.js'
import { initDatabase } from './bootstrap.js'

const port = process.env.PORT || 3000

const start = async () => {
  await initDatabase()
  app.listen(port, () => {
    console.log(`server running at http://127.0.0.1:${port}`)
  })
}

start().catch((error) => {
  console.error('server start failed', error)
  process.exit(1)
})
