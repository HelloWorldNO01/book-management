import express from 'express'
import apiRouter from './routes/api.js'

const app = express()

app.use(express.json())
app.use('/api', apiRouter)

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use((error, _req, res, _next) => {
  const statusCode = error.message.includes('不存在') || error.message.includes('错误') ? 400 : 500
  res.status(statusCode).json({
    message: error.message || '服务器异常'
  })
})

export default app
