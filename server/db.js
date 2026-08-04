import mysql from 'mysql2/promise'
import { dbConfig } from './config.js'

let pool
let memoryMode = false

const createBaseConnection = async () =>
  mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password
  })

export const initPool = async () => {
  if (pool) return pool
  memoryMode = false

  const connection = await createBaseConnection()
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  )
  await connection.end()

  pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10
  })

  return pool
}

export const enableMemoryMode = () => {
  memoryMode = true
  pool = undefined
}

export const isMemoryMode = () => memoryMode

export const getPool = () => {
  if (!pool) {
    throw new Error('数据库连接池尚未初始化')
  }

  return pool
}

export const closePool = async () => {
  if (pool) {
    await pool.end()
    pool = undefined
  }
  memoryMode = false
}
