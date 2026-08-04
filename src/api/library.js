import http from './http'

export const login = (data) => http.post('/login', data)

export const getDashboard = () => http.get('/dashboard')

export const getBookList = (params) => http.get('/books', { params })

export const getBookDetail = (id) => http.get(`/books/${id}`)

export const createBook = (data) => http.post('/books', data)

export const updateBook = (id, data) => http.put(`/books/${id}`, data)

export const borrowBook = (data) => http.post('/borrow', data)

export const returnBook = (data) => http.post('/return', data)

export const getBorrowRecords = (params) => http.get('/borrow-records', { params })

export const getProfile = (userId) => http.get('/profile', { params: { userId } })

export const updateProfile = (id, data) => http.put(`/profile/${id}`, data)

export const getCategories = () => http.get('/categories')

export const createCategory = (data) => http.post('/categories', data)

export const updateCategory = (id, data) => http.put(`/categories/${id}`, data)

export const getUserByStudentId = (studentId) =>
  http.get('/users/by-student-id', { params: { studentId } })
