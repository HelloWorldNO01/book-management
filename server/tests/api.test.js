import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import app from '../app.js'
import { initDatabase } from '../bootstrap.js'
import { closePool } from '../db.js'

const startServer = async () => {
  await initDatabase()
  const server = createServer(app)
  await new Promise((resolve) => server.listen(0, resolve))
  const address = server.address()
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`
  }
}

const stopServer = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolve()
    })
  })

test.after(async () => {
  await closePool()
})

const getJson = async (response) => {
  const text = await response.text()
  return text ? JSON.parse(text) : {}
}

test('GET /api/dashboard 返回首页统计与表格数据', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/dashboard`)
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.ok(Array.isArray(data.stats))
    assert.ok(Array.isArray(data.recentRecords))
    assert.ok(Array.isArray(data.returnReminders))
    assert.ok(Array.isArray(data.todoItems))
  } finally {
    await stopServer(server)
  }
})

test('GET /api/books 支持关键字筛选', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/books?keyword=数据库&page=1&pageSize=10`)
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.equal(typeof data.total, 'number')
    assert.ok(Array.isArray(data.list))
  } finally {
    await stopServer(server)
  }
})

test('POST /api/login 可以返回演示账号信息', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: '20230001', password: 'demo123456' })
    })
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.equal(data.user.studentId, '20230001')
    assert.equal(data.message, '登录成功')
  } finally {
    await stopServer(server)
  }
})

test('GET /api/books/:id 可以返回图书详情', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/books/3`)
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.equal(data.id, 3)
    assert.equal(typeof data.title, 'string')
  } finally {
    await stopServer(server)
  }
})

test('GET /api/borrow-records 返回借阅记录列表', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/borrow-records?userId=1`)
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.ok(Array.isArray(data))
  } finally {
    await stopServer(server)
  }
})

test('POST /api/borrow 与 POST /api/return 形成完整借还流程', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const borrowResponse = await fetch(`${baseUrl}/api/borrow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: 4, userId: 1 })
    })
    assert.equal(borrowResponse.status, 200)
    const borrowData = await getJson(borrowResponse)

    assert.equal(borrowData.record.status, 'borrowed')

    const returnResponse = await fetch(`${baseUrl}/api/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordId: borrowData.record.id })
    })
    assert.equal(returnResponse.status, 200)
    const returnData = await getJson(returnResponse)

    assert.equal(returnData.record.status, 'returned')
  } finally {
    await stopServer(server)
  }
})

test('GET /api/profile 返回个人信息', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/profile?userId=1`)
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.equal(data.studentId, '20230001')
    assert.equal(typeof data.name, 'string')
  } finally {
    await stopServer(server)
  }
})

test('GET /api/categories 返回排序和状态字段', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/categories`)
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.ok(Array.isArray(data))
    assert.equal(typeof data[0].sortOrder, 'number')
    assert.equal(typeof data[0].status, 'string')
  } finally {
    await stopServer(server)
  }
})

test('GET /api/users/by-student-id 支持借阅办理页按学号查学生', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/users/by-student-id?studentId=20230001`)
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.equal(data.studentId, '20230001')
    assert.equal(typeof data.remainingQuota, 'number')
  } finally {
    await stopServer(server)
  }
})

test('PUT /api/profile/:id 支持个人中心保存资料', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/profile/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '张晓晨',
        phone: '13800001111',
        email: 'zhangxiaocheng@example.com',
        major: '软件工程'
      })
    })
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.equal(data.profile.phone, '13800001111')
  } finally {
    await stopServer(server)
  }
})

test('PUT /api/categories/:id 支持分类管理页编辑状态与排序', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/categories/4`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '历史',
        sortOrder: 5,
        status: 'enabled'
      })
    })
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.equal(data.category.sortOrder, 5)
    assert.equal(data.category.status, 'enabled')
  } finally {
    await stopServer(server)
  }
})

test('GET /api/borrow-records 支持时间范围筛选', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(
      `${baseUrl}/api/borrow-records?userId=1&startDate=2026-06-28&endDate=2026-06-29`
    )
    assert.equal(response.status, 200)
    const data = await getJson(response)

    assert.ok(Array.isArray(data))
    assert.ok(data.length >= 1)
  } finally {
    await stopServer(server)
  }
})
