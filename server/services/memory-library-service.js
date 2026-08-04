import { books as seedBooks, borrowRecords as seedRecords, categories as seedCategories, users as seedUsers } from '../data/seed-data.js'

let users = []
let categories = []
let books = []
let borrowRecords = []

const clone = (value) => JSON.parse(JSON.stringify(value))

const todayString = () => new Date().toISOString().slice(0, 10)

const addDays = (dateString, days) => {
  const date = new Date(dateString)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const toDateTime = () => new Date().toISOString().slice(0, 19).replace('T', ' ')

const publicUser = (user) => ({
  id: user.id,
  studentId: user.studentId,
  name: user.name,
  role: user.role,
  phone: user.phone,
  email: user.email,
  major: user.major
})

const bookWithCategory = (book) => ({
  ...book,
  categoryName: categories.find((category) => category.id === Number(book.categoryId))?.name || '未分类'
})

const recordWithNames = (record) => ({
  ...record,
  bookTitle: books.find((book) => book.id === Number(record.bookId))?.title || '未知图书',
  userName: users.find((user) => user.id === Number(record.userId))?.name || '未知用户'
})

export const resetMemoryStore = () => {
  users = clone(seedUsers)
  categories = clone(seedCategories).map((category, index) => ({
    createdAt: `2026-07-0${Math.min(index + 1, 9)} 09:00:00`,
    ...category
  }))
  books = clone(seedBooks)
  borrowRecords = clone(seedRecords)
}

resetMemoryStore()

export const login = async (studentId, password) => {
  const user = users.find((item) => item.studentId === studentId && item.password === password)
  if (!user) return null
  return {
    message: '登录成功',
    user: publicUser(user)
  }
}

export const getDashboard = async () => ({
  stats: [
    { label: '馆藏图书', value: books.length },
    { label: '当前借出', value: borrowRecords.filter((item) => ['borrowed', 'due'].includes(item.status)).length },
    { label: '逾期未还', value: borrowRecords.filter((item) => item.status === 'due').length },
    { label: '图书分类', value: categories.length }
  ],
  recentRecords: [...borrowRecords]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
    .map(recordWithNames),
  returnReminders: borrowRecords
    .filter((item) => ['borrowed', 'due'].includes(item.status))
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
    .slice(0, 5)
    .map((record) => {
      const named = recordWithNames(record)
      return {
        id: named.id,
        bookTitle: named.bookTitle,
        userName: named.userName,
        dueDate: named.dueDate
      }
    }),
  todoItems: [
    { id: 1, text: '核对到期未还图书', done: false },
    { id: 2, text: '整理新增图书入库信息', done: false },
    { id: 3, text: '检查库存为 0 的图书状态', done: false }
  ]
})

export const getBooks = async ({ keyword = '', categoryId, status, page = 1, pageSize = 10 }) => {
  const normalizedKeyword = String(keyword).trim().toLowerCase()
  let list = books.map(bookWithCategory)

  if (normalizedKeyword) {
    list = list.filter((book) =>
      `${book.title} ${book.author}`.toLowerCase().includes(normalizedKeyword)
    )
  }

  if (categoryId) {
    list = list.filter((book) => Number(book.categoryId) === Number(categoryId))
  }

  if (status) {
    list = list.filter((book) => book.status === status)
  }

  const total = list.length
  const start = (Number(page) - 1) * Number(pageSize)

  return {
    total,
    list: list.sort((a, b) => b.id - a.id).slice(start, start + Number(pageSize))
  }
}

export const getBookDetail = async (bookId) => {
  const book = books.find((item) => item.id === Number(bookId))
  return book ? bookWithCategory(book) : null
}

export const getBorrowRecords = async ({ userId, status, startDate, endDate }) => {
  let list = borrowRecords.map(recordWithNames)

  if (userId) {
    list = list.filter((record) => Number(record.userId) === Number(userId))
  }

  if (status) {
    list = list.filter((record) => record.status === status)
  }

  if (startDate) {
    list = list.filter((record) => record.borrowDate >= startDate)
  }

  if (endDate) {
    list = list.filter((record) => record.borrowDate <= endDate)
  }

  return list.sort((a, b) => b.id - a.id)
}

export const borrowBook = async ({ bookId, userId }) => {
  const book = books.find((item) => item.id === Number(bookId))
  const user = users.find((item) => item.id === Number(userId))

  if (!book) throw new Error('图书不存在')
  if (!user) throw new Error('用户不存在')
  if (Number(book.stock) <= 0) throw new Error('当前图书库存不足')

  const borrowDate = todayString()
  const record = {
    id: Math.max(1000, ...borrowRecords.map((item) => item.id)) + 1,
    bookId: Number(bookId),
    userId: Number(userId),
    borrowDate,
    dueDate: addDays(borrowDate, 7),
    returnDate: null,
    status: 'borrowed'
  }

  borrowRecords.push(record)
  book.stock = Number(book.stock) - 1
  user.stats.borrowedCount += 1

  return {
    message: '借阅成功',
    record
  }
}

export const returnBook = async ({ recordId }) => {
  const record = borrowRecords.find((item) => item.id === Number(recordId))
  if (!record) throw new Error('借阅记录不存在')
  if (record.status === 'returned') throw new Error('该图书已归还')

  const book = books.find((item) => item.id === Number(record.bookId))
  const user = users.find((item) => item.id === Number(record.userId))
  const returnDate = todayString()

  record.status = 'returned'
  record.returnDate = returnDate

  if (book) book.stock = Number(book.stock) + 1
  if (user) {
    user.stats.borrowedCount = Math.max(user.stats.borrowedCount - 1, 0)
    user.stats.returnedCount += 1
  }

  return {
    message: '归还成功',
    record
  }
}

export const getProfile = async (userId) => {
  const user = users.find((item) => item.id === Number(userId))
  if (!user) return null

  return {
    ...publicUser(user),
    stats: clone(user.stats)
  }
}

export const getCategories = async () =>
  categories
    .map((category) => ({
      ...category,
      bookCount: books.filter((book) => Number(book.categoryId) === Number(category.id)).length
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)

export const getUserByStudentId = async (studentId) => {
  const user = users.find((item) => item.studentId === studentId)
  if (!user) return null

  return {
    ...publicUser(user),
    currentBorrowed: user.stats.borrowedCount,
    overdueCount: user.stats.overdueCount,
    returnedCount: user.stats.returnedCount,
    remainingQuota: Math.max(3 - user.stats.borrowedCount, 0)
  }
}

export const createBook = async (payload) => {
  const book = {
    id: Math.max(0, ...books.map((item) => item.id)) + 1,
    title: payload.title,
    author: payload.author,
    categoryId: Number(payload.categoryId),
    cover: payload.cover || '',
    stock: Number(payload.stock),
    totalStock: Number(payload.totalStock ?? payload.stock),
    status: payload.status || 'available',
    description: payload.description || '',
    isbn: payload.isbn || '',
    publisher: payload.publisher || '',
    publishDate: payload.publishDate || '',
    shelfLocation: payload.shelfLocation || ''
  }

  books.push(book)
  return getBookDetail(book.id)
}

export const updateBook = async (bookId, payload) => {
  const book = books.find((item) => item.id === Number(bookId))
  if (!book) return null

  Object.assign(book, {
    title: payload.title,
    author: payload.author,
    categoryId: Number(payload.categoryId),
    cover: payload.cover || '',
    stock: Number(payload.stock),
    totalStock: Number(payload.totalStock ?? payload.stock),
    status: payload.status || 'available',
    description: payload.description || '',
    isbn: payload.isbn || '',
    publisher: payload.publisher || '',
    publishDate: payload.publishDate || '',
    shelfLocation: payload.shelfLocation || ''
  })

  return getBookDetail(bookId)
}

export const createCategory = async (payload) => {
  const category = {
    id: Math.max(0, ...categories.map((item) => item.id)) + 1,
    name: payload.name,
    sortOrder: Number(payload.sortOrder ?? categories.length + 1),
    status: payload.status || 'enabled',
    createdAt: toDateTime(),
    bookCount: 0
  }

  categories.push(category)
  return category
}

export const updateCategory = async (categoryId, payload) => {
  const category = categories.find((item) => item.id === Number(categoryId))
  if (!category) return null

  Object.assign(category, {
    name: payload.name,
    sortOrder: Number(payload.sortOrder),
    status: payload.status
  })

  return (await getCategories()).find((item) => item.id === Number(categoryId))
}

export const updateProfile = async (userId, payload) => {
  const user = users.find((item) => item.id === Number(userId))
  if (!user) return null

  Object.assign(user, {
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    major: payload.major
  })

  return getProfile(userId)
}
