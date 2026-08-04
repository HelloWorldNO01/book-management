import { borrowBook, getBookList } from '../api/library'

export const runGetExample = async () => {
  const result = await getBookList({
    keyword: '数据库',
    page: 1,
    pageSize: 5
  })

  console.log('GET /api/books 返回结果：', result)
  return result
}

export const runPostExample = async () => {
  const result = await borrowBook({
    bookId: 3,
    userId: 1
  })

  console.log('POST /api/borrow 返回结果：', result)
  return result
}
