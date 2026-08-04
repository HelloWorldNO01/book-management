export const users = [
  {
    id: 1,
    studentId: '20230001',
    password: 'demo123456',
    name: '张晓晨',
    role: '学生',
    phone: '13800000001',
    email: 'zhangxiaocheng@example.com',
    major: '软件工程',
    stats: {
      borrowedCount: 3,
      overdueCount: 0,
      returnedCount: 8
    }
  }
]

export const categories = [
  { id: 1, name: '文学' },
  { id: 2, name: '教材' },
  { id: 3, name: '技术' },
  { id: 4, name: '历史' }
]

export const books = [
  {
    id: 1,
    title: '活着',
    author: '余华',
    categoryId: 1,
    cover: '',
    stock: 2,
    totalStock: 2,
    status: 'available',
    description: '适合作为文学类列表展示示例。',
    isbn: '9787300000011',
    publisher: '作家出版社',
    publishDate: '2012-01',
    shelfLocation: 'A-01-03'
  },
  {
    id: 2,
    title: '计算机网络',
    author: '谢希仁',
    categoryId: 2,
    cover: '',
    stock: 0,
    totalStock: 4,
    status: 'unavailable',
    description: '适合作为库存不足状态示例。',
    isbn: '9787300000012',
    publisher: '电子工业出版社',
    publishDate: '2023-05',
    shelfLocation: 'B-02-11'
  },
  {
    id: 3,
    title: '数据库系统概论',
    author: '王珊',
    categoryId: 2,
    cover: '',
    stock: 5,
    totalStock: 6,
    status: 'available',
    description: '详情页与搜索功能的核心示例书籍。',
    isbn: '9787300000013',
    publisher: '高等教育出版社',
    publishDate: '2024-03',
    shelfLocation: 'B-03-14'
  },
  {
    id: 4,
    title: 'JavaScript 权威指南',
    author: 'David Flanagan',
    categoryId: 3,
    cover: '',
    stock: 3,
    totalStock: 3,
    status: 'available',
    description: '适合作为借书还书流程测试数据。',
    isbn: '9787300000014',
    publisher: '机械工业出版社',
    publishDate: '2022-10',
    shelfLocation: 'C-02-07'
  },
  {
    id: 5,
    title: '追风筝的人',
    author: '卡勒德·胡赛尼',
    categoryId: 1,
    cover: '',
    stock: 1,
    totalStock: 2,
    status: 'available',
    description: '适合作为文学类卡片和详情页示例。',
    isbn: '9787300000015',
    publisher: '上海人民出版社',
    publishDate: '2020-08',
    shelfLocation: 'A-02-10'
  }
]

export const borrowRecords = [
  {
    id: 1001,
    bookId: 4,
    userId: 1,
    borrowDate: '2026-06-28',
    dueDate: '2026-07-03',
    returnDate: null,
    status: 'due'
  },
  {
    id: 1002,
    bookId: 1,
    userId: 1,
    borrowDate: '2026-06-29',
    dueDate: '2026-07-04',
    returnDate: null,
    status: 'borrowed'
  },
  {
    id: 1003,
    bookId: 3,
    userId: 1,
    borrowDate: '2026-06-20',
    dueDate: '2026-06-30',
    returnDate: '2026-06-29',
    status: 'returned'
  }
]
