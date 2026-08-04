import axios from 'axios'

// 这里不是直接每次都写 axios.get / axios.post，
// 而是先创建一个“项目专用的 axios 实例”。
// 这样做的好处是：
// 1. 可以统一配置接口前缀
// 2. 可以统一配置超时时间
// 3. 后面可以统一加请求拦截器、响应拦截器
const http = axios.create({
  // 所有请求都会自动带上 /api 前缀
  // 例如：
  // http.get('/books') -> 实际请求 /api/books
  // http.post('/return') -> 实际请求 /api/return
  baseURL: '/api',
  timeout: 10000
})

http.interceptors.response.use(
  // 成功时，直接把 response.data 返回出去，
  // 这样页面里拿到的就是后端真正返回的数据对象，
  // 不需要每次都自己再写一次 response.data。
  (response) => response.data,
  (error) => {
    // 失败时，优先使用后端返回的 message。
    // 如果后端没返回明确报错，再给一个通用提示。
    const message = error.response?.data?.message || '请求失败，请稍后重试'
    return Promise.reject(new Error(message))
  }
)

export default http
