import { getPool, isMemoryMode } from '../db.js'
import * as memoryService from './memory-library-service.js'

const mapBook = (row) => ({
  id: row.id,
  title: row.title,
  author: row.author,
  categoryId: row.category_id,
  categoryName: row.category_name,
  cover: row.cover,
  stock: row.stock,
  totalStock: row.total_stock,
  status: row.status,
  description: row.description,
  isbn: row.isbn,
  publisher: row.publisher,
  publishDate: row.publish_date,
  shelfLocation: row.shelf_location
})

const mapRecord = (row) => ({
  id: row.id,
  bookId: row.book_id,
  bookTitle: row.book_title,
  userId: row.user_id,
  userName: row.user_name,
  borrowDate: row.borrow_date,
  dueDate: row.due_date,
  returnDate: row.return_date,
  status: row.status
})

const buildLike = (keyword) => `%${keyword}%`

export const login = async (studentId, password) => {
  if (isMemoryMode()) return memoryService.login(studentId, password)

  const pool = getPool()
  const [rows] = await pool.query(
    `SELECT id, student_id, name, role, phone, email, major
     FROM users
     WHERE student_id = ? AND password = ?`,
    [studentId, password]
  )

  if (rows.length === 0) {
    return null
  }

  const user = rows[0]
  return {
    message: '登录成功',
    user: {
      id: user.id,
      studentId: user.student_id,
      name: user.name,
      role: user.role,
      phone: user.phone,
      email: user.email,
      major: user.major
    }
  }
}

export const getDashboard = async () => {
  if (isMemoryMode()) return memoryService.getDashboard()

  const pool = getPool()
  const [[booksTotal]] = await pool.query('SELECT COUNT(*) AS total FROM books')
  const [[borrowedTotal]] = await pool.query(
    `SELECT COUNT(*) AS total FROM borrow_records WHERE status IN ('borrowed', 'due')`
  )
  const [[overdueTotal]] = await pool.query(
    `SELECT COUNT(*) AS total FROM borrow_records WHERE status = 'due'`
  )
  const [[categoryTotal]] = await pool.query('SELECT COUNT(*) AS total FROM categories')

  const [recentRows] = await pool.query(
    `SELECT br.id, br.book_id, b.title AS book_title, br.user_id, u.name AS user_name,
            DATE_FORMAT(br.borrow_date, '%Y-%m-%d') AS borrow_date,
            DATE_FORMAT(br.due_date, '%Y-%m-%d') AS due_date,
            DATE_FORMAT(br.return_date, '%Y-%m-%d') AS return_date,
            br.status
     FROM borrow_records br
     INNER JOIN books b ON b.id = br.book_id
     INNER JOIN users u ON u.id = br.user_id
     ORDER BY br.id DESC
     LIMIT 5`
  )

  const [reminderRows] = await pool.query(
    `SELECT br.id, b.title AS book_title, u.name AS user_name,
            DATE_FORMAT(br.due_date, '%Y-%m-%d') AS due_date
     FROM borrow_records br
     INNER JOIN books b ON b.id = br.book_id
     INNER JOIN users u ON u.id = br.user_id
     WHERE br.status IN ('borrowed', 'due')
     ORDER BY br.due_date ASC
     LIMIT 5`
  )

  return {
    stats: [
      { label: '馆藏图书', value: booksTotal.total },
      { label: '当前借出', value: borrowedTotal.total },
      { label: '逾期未还', value: overdueTotal.total },
      { label: '图书分类', value: categoryTotal.total }
    ],
    recentRecords: recentRows.map(mapRecord),
    returnReminders: reminderRows.map((row) => ({
      id: row.id,
      bookTitle: row.book_title,
      userName: row.user_name,
      dueDate: row.due_date
    })),
    todoItems: [
      { id: 1, text: '核对到期未还图书', done: false },
      { id: 2, text: '整理新增图书入库信息', done: false },
      { id: 3, text: '检查库存为 0 的图书状态', done: false }
    ]
  }
}

export const getBooks = async ({ keyword = '', categoryId, status, page = 1, pageSize = 10 }) => {
  if (isMemoryMode()) {
    return memoryService.getBooks({ keyword, categoryId, status, page, pageSize })
  }

  const pool = getPool()
  const conditions = []
  const values = []

  if (keyword) {
    conditions.push('(b.title LIKE ? OR b.author LIKE ?)')
    values.push(buildLike(keyword), buildLike(keyword))
  }

  if (categoryId) {
    conditions.push('b.category_id = ?')
    values.push(Number(categoryId))
  }

  if (status) {
    conditions.push('b.status = ?')
    values.push(status)
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const offset = (Number(page) - 1) * Number(pageSize)

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM books b
     ${whereSql}`,
    values
  )

  const [rows] = await pool.query(
    `SELECT b.*, c.name AS category_name
     FROM books b
     INNER JOIN categories c ON c.id = b.category_id
     ${whereSql}
     ORDER BY b.id DESC
     LIMIT ? OFFSET ?`,
    [...values, Number(pageSize), offset]
  )

  return {
    total: countRows[0].total,
    list: rows.map(mapBook)
  }
}

export const getBookDetail = async (bookId) => {
  if (isMemoryMode()) return memoryService.getBookDetail(bookId)

  const pool = getPool()
  const [rows] = await pool.query(
    `SELECT b.*, c.name AS category_name
     FROM books b
     INNER JOIN categories c ON c.id = b.category_id
     WHERE b.id = ?`,
    [bookId]
  )

  if (rows.length === 0) {
    return null
  }

  return mapBook(rows[0])
}

export const getBorrowRecords = async ({ userId, status, startDate, endDate }) => {
  if (isMemoryMode()) {
    return memoryService.getBorrowRecords({ userId, status, startDate, endDate })
  }

  const pool = getPool()
  const conditions = []
  const values = []

  if (userId) {
    conditions.push('br.user_id = ?')
    values.push(Number(userId))
  }

  if (status) {
    conditions.push('br.status = ?')
    values.push(status)
  }

  if (startDate) {
    conditions.push('br.borrow_date >= ?')
    values.push(startDate)
  }

  if (endDate) {
    conditions.push('br.borrow_date <= ?')
    values.push(endDate)
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const [rows] = await pool.query(
    `SELECT br.id, br.book_id, b.title AS book_title, br.user_id, u.name AS user_name,
            DATE_FORMAT(br.borrow_date, '%Y-%m-%d') AS borrow_date,
            DATE_FORMAT(br.due_date, '%Y-%m-%d') AS due_date,
            DATE_FORMAT(br.return_date, '%Y-%m-%d') AS return_date,
            br.status
     FROM borrow_records br
     INNER JOIN books b ON b.id = br.book_id
     INNER JOIN users u ON u.id = br.user_id
     ${whereSql}
     ORDER BY br.id DESC`,
    values
  )

  return rows.map(mapRecord)
}

export const borrowBook = async ({ bookId, userId }) => {
  if (isMemoryMode()) return memoryService.borrowBook({ bookId, userId })

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [[book]] = await connection.query('SELECT * FROM books WHERE id = ? FOR UPDATE', [bookId])
    if (!book) throw new Error('图书不存在')
    if (book.stock <= 0) throw new Error('当前图书库存不足')

    const [[maxRow]] = await connection.query('SELECT IFNULL(MAX(id), 1000) + 1 AS nextId FROM borrow_records')
    const today = new Date()
    const due = new Date(today)
    due.setDate(due.getDate() + 7)
    const formatDate = (date) => date.toISOString().slice(0, 10)

    await connection.query(
      `INSERT INTO borrow_records (id, book_id, user_id, borrow_date, due_date, return_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [maxRow.nextId, Number(bookId), Number(userId), formatDate(today), formatDate(due), null, 'borrowed']
    )
    await connection.query('UPDATE books SET stock = stock - 1 WHERE id = ?', [bookId])
    await connection.query(
      'UPDATE user_stats SET borrowed_count = borrowed_count + 1 WHERE user_id = ?',
      [userId]
    )

    await connection.commit()
    return {
      message: '借阅成功',
      record: {
        id: maxRow.nextId,
        bookId: Number(bookId),
        userId: Number(userId),
        borrowDate: formatDate(today),
        dueDate: formatDate(due),
        returnDate: null,
        status: 'borrowed'
      }
    }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export const returnBook = async ({ recordId }) => {
  if (isMemoryMode()) return memoryService.returnBook({ recordId })

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [[record]] = await connection.query(
      'SELECT * FROM borrow_records WHERE id = ? FOR UPDATE',
      [recordId]
    )
    if (!record) throw new Error('借阅记录不存在')
    if (record.status === 'returned') throw new Error('该图书已归还')

    const today = new Date().toISOString().slice(0, 10)

    await connection.query(
      `UPDATE borrow_records
       SET status = 'returned', return_date = ?
       WHERE id = ?`,
      [today, recordId]
    )
    await connection.query('UPDATE books SET stock = stock + 1 WHERE id = ?', [record.book_id])
    await connection.query(
      `UPDATE user_stats
       SET borrowed_count = GREATEST(borrowed_count - 1, 0),
           returned_count = returned_count + 1
       WHERE user_id = ?`,
      [record.user_id]
    )

    await connection.commit()
    return {
      message: '归还成功',
      record: {
        id: record.id,
        bookId: record.book_id,
        userId: record.user_id,
        borrowDate: record.borrow_date,
        dueDate: record.due_date,
        returnDate: today,
        status: 'returned'
      }
    }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export const getProfile = async (userId) => {
  if (isMemoryMode()) return memoryService.getProfile(userId)

  const pool = getPool()
  const [rows] = await pool.query(
    `SELECT u.id, u.student_id, u.name, u.role, u.phone, u.email, u.major,
            s.borrowed_count, s.overdue_count, s.returned_count
     FROM users u
     INNER JOIN user_stats s ON s.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  )

  if (rows.length === 0) {
    return null
  }

  const user = rows[0]
  return {
    id: user.id,
    studentId: user.student_id,
    name: user.name,
    role: user.role,
    phone: user.phone,
    email: user.email,
    major: user.major,
    stats: {
      borrowedCount: user.borrowed_count,
      overdueCount: user.overdue_count,
      returnedCount: user.returned_count
    }
  }
}

export const getCategories = async () => {
  if (isMemoryMode()) return memoryService.getCategories()

  const pool = getPool()
  const [rows] = await pool.query(
    `SELECT c.id, c.name, c.sort_order, c.status,
            DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            COUNT(b.id) AS book_count
     FROM categories c
     LEFT JOIN books b ON b.category_id = c.id
     GROUP BY c.id, c.name, c.sort_order, c.status, c.created_at
     ORDER BY c.sort_order ASC, c.id ASC`
  )

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order,
    status: row.status,
    createdAt: row.created_at,
    bookCount: row.book_count
  }))
}

export const getUserByStudentId = async (studentId) => {
  if (isMemoryMode()) return memoryService.getUserByStudentId(studentId)

  const pool = getPool()
  const [rows] = await pool.query(
    `SELECT u.id, u.student_id, u.name, u.role, u.phone, u.email, u.major,
            s.borrowed_count, s.overdue_count, s.returned_count
     FROM users u
     INNER JOIN user_stats s ON s.user_id = u.id
     WHERE u.student_id = ?`,
    [studentId]
  )

  if (rows.length === 0) {
    return null
  }

  const user = rows[0]
  return {
    id: user.id,
    studentId: user.student_id,
    name: user.name,
    role: user.role,
    phone: user.phone,
    email: user.email,
    major: user.major,
    currentBorrowed: user.borrowed_count,
    overdueCount: user.overdue_count,
    returnedCount: user.returned_count,
    remainingQuota: Math.max(3 - user.borrowed_count, 0)
  }
}

export const createBook = async (payload) => {
  if (isMemoryMode()) return memoryService.createBook(payload)

  const pool = getPool()
  const [[maxRow]] = await pool.query('SELECT IFNULL(MAX(id), 0) + 1 AS nextId FROM books')

  await pool.query(
    `INSERT INTO books
    (id, title, author, category_id, cover, stock, total_stock, status, description, isbn, publisher, publish_date, shelf_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      maxRow.nextId,
      payload.title,
      payload.author,
      Number(payload.categoryId),
      payload.cover || '',
      Number(payload.stock),
      Number(payload.totalStock ?? payload.stock),
      payload.status || 'available',
      payload.description || '',
      payload.isbn || '',
      payload.publisher || '',
      payload.publishDate || '',
      payload.shelfLocation || ''
    ]
  )

  return getBookDetail(maxRow.nextId)
}

export const updateBook = async (bookId, payload) => {
  if (isMemoryMode()) return memoryService.updateBook(bookId, payload)

  const pool = getPool()
  await pool.query(
    `UPDATE books
     SET title = ?, author = ?, category_id = ?, cover = ?, stock = ?, total_stock = ?,
         status = ?, description = ?, isbn = ?, publisher = ?, publish_date = ?, shelf_location = ?
     WHERE id = ?`,
    [
      payload.title,
      payload.author,
      Number(payload.categoryId),
      payload.cover || '',
      Number(payload.stock),
      Number(payload.totalStock ?? payload.stock),
      payload.status || 'available',
      payload.description || '',
      payload.isbn || '',
      payload.publisher || '',
      payload.publishDate || '',
      payload.shelfLocation || '',
      Number(bookId)
    ]
  )

  return getBookDetail(bookId)
}

export const createCategory = async (payload) => {
  if (isMemoryMode()) return memoryService.createCategory(payload)

  const pool = getPool()
  const [[maxRow]] = await pool.query('SELECT IFNULL(MAX(id), 0) + 1 AS nextId FROM categories')
  await pool.query(
    `INSERT INTO categories (id, name, sort_order, status)
     VALUES (?, ?, ?, ?)`,
    [maxRow.nextId, payload.name, Number(payload.sortOrder ?? maxRow.nextId), payload.status || 'enabled']
  )
  return {
    id: maxRow.nextId,
    name: payload.name,
    sortOrder: Number(payload.sortOrder ?? maxRow.nextId),
    status: payload.status || 'enabled',
    bookCount: 0
  }
}

export const updateCategory = async (categoryId, payload) => {
  if (isMemoryMode()) return memoryService.updateCategory(categoryId, payload)

  const pool = getPool()
  await pool.query(
    `UPDATE categories
     SET name = ?, sort_order = ?, status = ?
     WHERE id = ?`,
    [payload.name, Number(payload.sortOrder), payload.status, Number(categoryId)]
  )

  const [rows] = await pool.query(
    `SELECT c.id, c.name, c.sort_order, c.status,
            DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            COUNT(b.id) AS book_count
     FROM categories c
     LEFT JOIN books b ON b.category_id = c.id
     WHERE c.id = ?
     GROUP BY c.id, c.name, c.sort_order, c.status, c.created_at`,
    [Number(categoryId)]
  )

  if (rows.length === 0) {
    return null
  }

  const category = rows[0]
  return {
    id: category.id,
    name: category.name,
    sortOrder: category.sort_order,
    status: category.status,
    createdAt: category.created_at,
    bookCount: category.book_count
  }
}

export const updateProfile = async (userId, payload) => {
  if (isMemoryMode()) return memoryService.updateProfile(userId, payload)

  const pool = getPool()
  await pool.query(
    `UPDATE users
     SET name = ?, phone = ?, email = ?, major = ?
     WHERE id = ?`,
    [payload.name, payload.phone, payload.email, payload.major, Number(userId)]
  )

  return getProfile(userId)
}
