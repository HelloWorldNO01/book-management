import express from 'express'
import {
  borrowBook,
  createBook,
  createCategory,
  getBookDetail,
  getBooks,
  getBorrowRecords,
  getCategories,
  getDashboard,
  getProfile,
  getUserByStudentId,
  login,
  returnBook,
  updateCategory,
  updateProfile,
  updateBook
} from '../services/library-service.js'

const router = express.Router()

router.get('/dashboard', async (_req, res, next) => {
  try {
    res.json(await getDashboard())
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { studentId, password } = req.body
    const result = await login(studentId, password)

    if (!result) {
      res.status(401).json({ message: '学号或密码错误' })
      return
    }

    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/books', async (req, res, next) => {
  try {
    res.json(await getBooks(req.query))
  } catch (error) {
    next(error)
  }
})

router.get('/books/:id', async (req, res, next) => {
  try {
    const book = await getBookDetail(req.params.id)
    if (!book) {
      res.status(404).json({ message: '图书不存在' })
      return
    }

    res.json(book)
  } catch (error) {
    next(error)
  }
})

router.post('/books', async (req, res, next) => {
  try {
    const book = await createBook(req.body)
    res.status(201).json({ message: '图书创建成功', book })
  } catch (error) {
    next(error)
  }
})

router.put('/books/:id', async (req, res, next) => {
  try {
    const book = await updateBook(req.params.id, req.body)
    if (!book) {
      res.status(404).json({ message: '图书不存在' })
      return
    }

    res.json({ message: '图书更新成功', book })
  } catch (error) {
    next(error)
  }
})

router.get('/borrow-records', async (req, res, next) => {
  try {
    res.json(await getBorrowRecords(req.query))
  } catch (error) {
    next(error)
  }
})

router.get('/users/by-student-id', async (req, res, next) => {
  try {
    const user = await getUserByStudentId(req.query.studentId)
    if (!user) {
      res.status(404).json({ message: '用户不存在' })
      return
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.post('/borrow', async (req, res, next) => {
  try {
    res.json(await borrowBook(req.body))
  } catch (error) {
    next(error)
  }
})

router.post('/return', async (req, res, next) => {
  try {
    res.json(await returnBook(req.body))
  } catch (error) {
    next(error)
  }
})

router.get('/profile', async (req, res, next) => {
  try {
    const profile = await getProfile(Number(req.query.userId))
    if (!profile) {
      res.status(404).json({ message: '用户不存在' })
      return
    }

    res.json(profile)
  } catch (error) {
    next(error)
  }
})

router.put('/profile/:id', async (req, res, next) => {
  try {
    const profile = await updateProfile(req.params.id, req.body)
    if (!profile) {
      res.status(404).json({ message: '用户不存在' })
      return
    }

    res.json({ message: '个人资料更新成功', profile })
  } catch (error) {
    next(error)
  }
})

router.get('/categories', async (_req, res, next) => {
  try {
    res.json(await getCategories())
  } catch (error) {
    next(error)
  }
})

router.post('/categories', async (req, res, next) => {
  try {
    const category = await createCategory(req.body)
    res.status(201).json({ message: '分类创建成功', category })
  } catch (error) {
    next(error)
  }
})

router.put('/categories/:id', async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body)
    if (!category) {
      res.status(404).json({ message: '分类不存在' })
      return
    }

    res.json({ message: '分类更新成功', category })
  } catch (error) {
    next(error)
  }
})

export default router
