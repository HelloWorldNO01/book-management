import { books, borrowRecords, categories, users } from './data/seed-data.js'
import { enableMemoryMode, initPool } from './db.js'
import { resetMemoryStore } from './services/memory-library-service.js'

const createTablesSql = `
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL UNIQUE,
  password VARCHAR(64) NOT NULL,
  name VARCHAR(64) NOT NULL,
  role VARCHAR(32) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(128) NOT NULL,
  major VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_stats (
  user_id INT PRIMARY KEY,
  borrowed_count INT NOT NULL,
  overdue_count INT NOT NULL,
  returned_count INT NOT NULL,
  CONSTRAINT fk_user_stats_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INT PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  author VARCHAR(128) NOT NULL,
  category_id INT NOT NULL,
  cover VARCHAR(255) NOT NULL,
  stock INT NOT NULL,
  total_stock INT NOT NULL,
  status VARCHAR(32) NOT NULL,
  description TEXT NOT NULL,
  isbn VARCHAR(32) NOT NULL,
  publisher VARCHAR(128) NOT NULL,
  publish_date VARCHAR(32) NOT NULL,
  shelf_location VARCHAR(64) NOT NULL,
  CONSTRAINT fk_books_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS borrow_records (
  id INT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE NULL,
  status VARCHAR(32) NOT NULL,
  CONSTRAINT fk_records_book FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT fk_records_user FOREIGN KEY (user_id) REFERENCES users(id)
);
`

const seedUsers = async (pool) => {
  for (const user of users) {
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE student_id = ?', [user.studentId])

    if (existingUsers.length > 0) {
      await pool.query('UPDATE users SET password = ? WHERE student_id = ?', [user.password, user.studentId])
      continue
    }

    await pool.query(
      `INSERT INTO users (id, student_id, password, name, role, phone, email, major)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.studentId, user.password, user.name, user.role, user.phone, user.email, user.major]
    )

    await pool.query(
      `INSERT INTO user_stats (user_id, borrowed_count, overdue_count, returned_count)
       VALUES (?, ?, ?, ?)`,
      [user.id, user.stats.borrowedCount, user.stats.overdueCount, user.stats.returnedCount]
    )
  }
}

const seedCategories = async (pool) => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM categories')
  if (rows[0].total > 0) return

  for (const category of categories) {
    await pool.query(
      `INSERT INTO categories (id, name, sort_order, status)
       VALUES (?, ?, ?, ?)`,
      [category.id, category.name, category.sortOrder, category.status]
    )
  }
}

const seedBooks = async (pool) => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM books')
  if (rows[0].total > 0) return

  for (const book of books) {
    await pool.query(
      `INSERT INTO books
      (id, title, author, category_id, cover, stock, total_stock, status, description, isbn, publisher, publish_date, shelf_location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        book.id,
        book.title,
        book.author,
        book.categoryId,
        book.cover,
        book.stock,
        book.totalStock,
        book.status,
        book.description,
        book.isbn,
        book.publisher,
        book.publishDate,
        book.shelfLocation
      ]
    )
  }
}

const seedBorrowRecords = async (pool) => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM borrow_records')
  if (rows[0].total > 0) return

  for (const record of borrowRecords) {
    await pool.query(
      `INSERT INTO borrow_records (id, book_id, user_id, borrow_date, due_date, return_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [record.id, record.bookId, record.userId, record.borrowDate, record.dueDate, record.returnDate, record.status]
    )
  }
}

const ensureColumn = async (pool, tableName, columnName, sql) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  )

  if (rows[0].total === 0) {
    await pool.query(sql)
  }
}

const ensureSchemaColumns = async (pool) => {
  await ensureColumn(pool, 'categories', 'sort_order', 'ALTER TABLE categories ADD COLUMN sort_order INT NOT NULL DEFAULT 0')
  await ensureColumn(
    pool,
    'categories',
    'status',
    "ALTER TABLE categories ADD COLUMN status VARCHAR(32) NOT NULL DEFAULT 'enabled'"
  )
  await ensureColumn(
    pool,
    'categories',
    'created_at',
    'ALTER TABLE categories ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'
  )
}

export const initDatabase = async () => {
  let pool

  try {
    pool = await initPool()
  } catch (error) {
    enableMemoryMode()
    resetMemoryStore()
    console.warn(`database unavailable, using in-memory demo data: ${error.message}`)
    return null
  }

  for (const statement of createTablesSql.split(';').map((item) => item.trim()).filter(Boolean)) {
    await pool.query(statement)
  }
  await ensureSchemaColumns(pool)
  await seedUsers(pool)
  await seedCategories(pool)
  await seedBooks(pool)
  await seedBorrowRecords(pool)
  return pool
}
