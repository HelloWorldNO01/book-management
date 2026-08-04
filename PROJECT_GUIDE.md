# 图书借阅管理系统综合实战说明

## 一、这个项目实现什么

1. 登录页
   - 输入学号和密码。
   - 点击登录后调用 `POST /api/login`。
   - 登录成功后跳转到首页控制台。

2. 首页控制台
   - 展示统计卡片：馆藏图书、当前借出、逾期未还、图书分类。
   - 展示最近借阅记录。
   - 展示待归还提醒。
   - 页面进入时调用 `GET /api/dashboard`。

3. 图书列表页
   - 支持关键词搜索。
   - 支持分类筛选。
   - 支持状态筛选。
   - 支持分页展示。
   - 点击某条图书进入详情页。
   - 页面核心接口：`GET /api/books`、`GET /api/categories`。

4. 图书详情页
   - 展示图书封面、书名、作者、分类、库存、状态、简介、馆藏位置。
   - 点击“立即借阅”后调用 `POST /api/borrow`。
   - 返回列表按钮回到图书列表页。
   - 页面核心接口：`GET /api/books/:id`、`POST /api/borrow`。

5. 我的借阅页
   - 展示借阅记录表格。
   - 展示借阅日期、应还日期、状态、操作。
   - 支持按状态筛选。
   - 支持按时间范围筛选。
   - 点击“归还”后调用 `POST /api/return`。
   - 页面核心接口：`GET /api/borrow-records`、`POST /api/return`。

6. 个人中心页
   - 展示学生姓名、学号、身份、个人资料。
   - 展示借阅统计。
   - 支持修改手机号、邮箱、专业等资料。
   - 点击保存后调用 `PUT /api/profile/:id`。
   - 页面核心接口：`GET /api/profile`、`PUT /api/profile/:id`。

7. 新增图书页
   - 填写图书名称、作者、分类、库存、馆藏位置、简介等信息。
   - 点击保存后新增图书。
   - 页面核心接口：`POST /api/books`、`GET /api/categories`。

8. 编辑图书页
   - 先根据图书 id 获取详情并回显到表单。
   - 修改后提交更新。
   - 页面核心接口：`GET /api/books/:id`、`PUT /api/books/:id`、`GET /api/categories`。

9. 分类管理页
   - 展示分类名称、图书数量、排序值、状态。
   - 支持新增分类。
   - 支持编辑分类状态与排序值。
   - 页面核心接口：`GET /api/categories`、`POST /api/categories`、`PUT /api/categories/:id`。

10. 借阅办理页
    - 先根据学号查学生。
    - 再搜索可借图书。
    - 选择图书后提交借阅。
    - 页面核心接口：`GET /api/users/by-student-id`、`GET /api/books`、`POST /api/borrow`。

## 二、每部分需要用到哪些 Vue 知识点

### 1. 登录页

需要用到的知识点：

- `ref`
  - 用来保存学号和密码输入框的值。
  - 解决“表单输入内容怎么参与提交”的问题。

- `v-model`
  - 让输入框和响应式数据双向绑定。
  - 解决“输入框变化后数据同步更新”的问题。

- 事件绑定 `@click` / `@submit`
  - 点击登录按钮时触发登录方法。
  - 解决“用户操作后如何执行请求”的问题。

- 条件渲染 `v-if`
  - 可用于显示登录中、报错提示、登录成功提示。
  - 解决“不同状态下界面展示不同内容”的问题。

- axios 请求封装
  - 登录页通常是学生第一次发 POST 请求的地方。
  - 解决“如何把表单数据提交给后端”的问题。

### 2. 首页控制台

需要用到的知识点：

- `onMounted`
  - 页面一进入就拉取首页数据。
  - 解决“页面初始化时自动请求接口”的问题。

- `reactive` / `ref`
  - 保存统计卡片、借阅记录、提醒列表。
  - 解决“接口返回后怎么统一管理页面数据”的问题。

- 列表渲染 `v-for`
  - 渲染统计卡片、最近借阅记录、提醒列表。
  - 解决“接口数组数据如何批量渲染”的问题。

- 组件拆分
  - 统计卡片、表格卡片、提醒卡片都适合拆成组件。
  - 解决“页面结构太长、重复代码太多”的问题。

### 3. 图书列表页

需要用到的知识点：

- 查询条件绑定
  - 关键词、分类、状态，都可以用 `v-model` 绑定。
  - 解决“筛选条件如何和页面状态同步”的问题。

- 方法封装
  - 把“获取图书列表”封装成单独函数，如 `loadBooks()`。
  - 解决“搜索、翻页、重置时重复写请求逻辑”的问题。

- 路由跳转
  - 点击表格某一项后跳转到详情页。
  - 解决“列表和详情之间如何串联”的问题。

- 分页状态
  - 用 `currentPage`、`pageSize`、`total` 管理分页。
  - 解决“翻页时如何带着参数重新请求”的问题。

### 4. 图书详情页

需要用到的知识点：

- `useRoute`
  - 从路由参数中获取图书 id。
  - 解决“详情页怎么知道当前是哪一本书”的问题。

- 详情请求
  - 根据 id 调 `GET /api/books/:id`。
  - 解决“如何按 id 获取单条数据”的问题。

- 条件渲染
  - 根据 `stock` 或 `status` 控制“立即借阅”按钮是否可点。
  - 解决“库存不足时如何阻止错误操作”的问题。

- 事件处理
  - 点击借阅按钮后调用 `POST /api/borrow`。
  - 解决“详情页主操作怎么和后端联动”的问题。

### 5. 我的借阅页

需要用到的知识点：

- 表格列表渲染
  - 借阅记录本质就是一个数组表格。
  - 解决“如何展示多列业务数据”的问题。

- 筛选与查询参数
  - 状态、开始时间、结束时间都要参与请求。
  - 解决“前端筛选条件如何传给后端”的问题。

- 状态标签
  - 根据 `borrowed / due / returned` 显示不同颜色。
  - 解决“状态数据如何更直观地展示”的问题。

- 局部刷新
  - 归还成功后，重新请求借阅记录列表。
  - 解决“操作成功后页面如何同步最新数据”的问题。

### 6. 个人中心页

需要用到的知识点：

- 对象回显
  - 把接口返回的个人资料回填到表单中。
  - 解决“编辑表单初始值从哪里来”的问题。

- 受控表单
  - 手机号、邮箱、专业修改后提交。
  - 解决“编辑表单的数据如何统一管理”的问题。

- 提交更新
  - 点击保存后调用 `PUT /api/profile/:id`。
  - 解决“前端修改后的数据如何保存到后端”的问题。

### 7. 新增图书页 / 编辑图书页

需要用到的知识点：

- 表单复用思想
  - 新增和编辑字段几乎一致，建议共用一套表单组件。
  - 解决“类似页面重复开发”的问题。

- `props` 与 `emit`
  - 如果拆子组件，可以通过 `props` 传默认值，通过 `emit` 提交数据。
  - 解决“父子组件之间如何传递表单数据”的问题。

- 新增与编辑的区别
  - 新增调用 `POST /api/books`。
  - 编辑调用 `PUT /api/books/:id`。
  - 解决“同一套表单如何适配不同业务动作”的问题。

### 8. 分类管理页

需要用到的知识点：

- 列表维护
  - 分类列表、状态、排序值都适合用表格方式展示。
  - 解决“管理型页面如何组织结构”的问题。

- 弹窗或内嵌表单
  - 新增分类、编辑分类都适合用小表单。
  - 解决“单页内如何处理小范围编辑”的问题。

- 局部更新
  - 编辑成功后刷新分类列表。
  - 解决“管理页更新后如何保持页面一致性”的问题。

### 9. 借阅办理页

需要用到的知识点：

- 多接口串联
  - 先查学生，再查图书，最后提交借阅。
  - 解决“一个页面涉及多个接口时如何组织顺序”的问题。

- 主从信息展示
  - 左侧展示学生信息，右侧展示可借图书。
  - 解决“复杂页面如何拆成两个区域协同展示”的问题。

- 操作确认
  - 选择图书后，再点击提交借阅。
  - 解决“避免误操作、确保业务流程完整”的问题。

## 三、接口详细解析文档

下面的字段说明，建议学生边写页面边对照。

### 1. 登录接口

接口：`POST /api/login`

请求体：

```json
{
  "studentId": "20230001",
  "password": "demo123456"
}
```

字段说明：

- `studentId`：学号，登录账号。
- `password`：密码。

成功返回：

```json
{
  "message": "登录成功",
  "user": {
    "id": 1,
    "studentId": "20230001",
    "name": "张晓晨",
    "role": "学生",
    "phone": "13800000001",
    "email": "zhangxiaocheng@example.com",
    "major": "软件工程"
  }
}
```

返回字段说明：

- `message`：后端返回的提示信息。
- `user.id`：用户主键，后续很多接口都会用到。
- `user.studentId`：学号。
- `user.name`：姓名。
- `user.role`：身份，例如学生。
- `user.phone`：手机号。
- `user.email`：邮箱。
- `user.major`：专业。

### 2. 首页数据接口

接口：`GET /api/dashboard`

成功返回核心结构：

```json
{
  "stats": [],
  "recentRecords": [],
  "returnReminders": [],
  "todoItems": []
}
```

字段说明：

- `stats`：统计卡片数组。
  - `label`：卡片标题。
  - `value`：卡片数值。
- `recentRecords`：最近借阅记录。
  - `bookTitle`：书名。
  - `userName`：借阅人。
  - `borrowDate`：借阅日期。
  - `dueDate`：应还日期。
  - `status`：借阅状态。
- `returnReminders`：待归还提醒。
  - `bookTitle`：图书名。
  - `userName`：借阅人。
  - `dueDate`：到期时间。
- `todoItems`：页面右侧待办事项。

### 3. 图书列表接口

接口：`GET /api/books`

请求参数：

- `keyword`：关键词，可搜书名或作者。
- `categoryId`：分类 id。
- `status`：图书状态，如 `available`、`unavailable`。
- `page`：页码。
- `pageSize`：每页条数。

示例：

```text
GET /api/books?keyword=数据库&page=1&pageSize=5
```

成功返回：

```json
{
  "total": 5,
  "list": [
    {
      "id": 3,
      "title": "数据库系统概论",
      "author": "王珊",
      "categoryId": 2,
      "categoryName": "教材",
      "cover": "",
      "stock": 5,
      "totalStock": 6,
      "status": "available",
      "description": "详情页与搜索功能的核心示例图书。",
      "isbn": "9787300000013",
      "publisher": "高等教育出版社",
      "publishDate": "2024-03",
      "shelfLocation": "B-03-14"
    }
  ]
}
```

字段说明：

- `total`：符合当前筛选条件的总条数。
- `list`：当前页数据数组。
- `id`：图书 id。
- `title`：书名。
- `author`：作者。
- `categoryId`：分类 id。
- `categoryName`：分类中文名。
- `cover`：封面地址。
- `stock`：当前可借库存。
- `totalStock`：总库存。
- `status`：图书状态。
- `description`：简介。
- `isbn`：图书编号。
- `publisher`：出版社。
- `publishDate`：出版时间。
- `shelfLocation`：馆藏位置。

### 4. 图书详情接口

接口：`GET /api/books/:id`

用途：

- 根据图书 id 获取单本图书详情。
- 字段结构和图书列表中的单项对象基本一致。

### 5. 借阅记录接口

接口：`GET /api/borrow-records`

请求参数：

- `userId`：用户 id。
- `status`：借阅状态。
- `startDate`：开始日期。
- `endDate`：结束日期。

成功返回字段说明：

- `id`：借阅记录 id。
- `bookId`：图书 id。
- `bookTitle`：书名。
- `userId`：用户 id。
- `userName`：用户名。
- `borrowDate`：借阅日期。
- `dueDate`：应还日期。
- `returnDate`：归还日期，未归还时为 `null`。
- `status`：借阅状态，常见值：`borrowed`、`due`、`returned`。

### 6. 借书接口

接口：`POST /api/borrow`

请求体：

```json
{
  "bookId": 3,
  "userId": 1
}
```

字段说明：

- `bookId`：要借的图书 id。
- `userId`：借书学生的 id。

成功返回：

```json
{
  "message": "借阅成功",
  "record": {
    "id": 1004,
    "bookId": 3,
    "userId": 1,
    "borrowDate": "2026-07-01",
    "dueDate": "2026-07-08",
    "returnDate": null,
    "status": "borrowed"
  }
}
```

### 7. 还书接口

接口：`POST /api/return`

请求体：

```json
{
  "recordId": 1004
}
```

字段说明：

- `recordId`：借阅记录 id，不是图书 id。

成功返回中的 `record.status` 会变成 `returned`。

### 8. 个人资料接口

接口：`GET /api/profile?userId=1`

字段说明：

- `id`：用户 id。
- `studentId`：学号。
- `name`：姓名。
- `role`：身份。
- `phone`：手机号。
- `email`：邮箱。
- `major`：专业。
- `stats.borrowedCount`：当前借阅数量。
- `stats.overdueCount`：逾期次数。
- `stats.returnedCount`：已归还数量。

更新接口：`PUT /api/profile/:id`

请求体字段：

- `name`
- `phone`
- `email`
- `major`

### 9. 分类接口

接口：`GET /api/categories`

返回字段说明：

- `id`：分类 id。
- `name`：分类名称。
- `sortOrder`：排序值。
- `status`：状态，常见值 `enabled`、`disabled`。
- `createdAt`：创建时间。
- `bookCount`：该分类下的图书数量。

新增接口：`POST /api/categories`

请求体：

```json
{
  "name": "哲学",
  "sortOrder": 6,
  "status": "enabled"
}
```

更新接口：`PUT /api/categories/:id`

请求体字段与新增一致。

### 10. 借阅办理页查学生接口

接口：`GET /api/users/by-student-id?studentId=20230001`

返回字段说明：

- `id`：用户 id。
- `studentId`：学号。
- `name`：姓名。
- `role`：身份。
- `phone`：手机号。
- `email`：邮箱。
- `major`：专业。
- `currentBorrowed`：当前借阅数量。
- `overdueCount`：逾期次数。
- `returnedCount`：已归还数量。
- `remainingQuota`：剩余可借数量。

## 四、给学生的接口调用示例

项目里已经准备了两个示例文件：

- `src/api/library.js`：接口封装
- `src/examples/api-demo.js`：GET 和 POST 的调用示例

### GET 示例：获取图书列表

```js
import { getBookList } from '../api/library'

const loadBooks = async () => {
  const res = await getBookList({
    keyword: '数据库',
    page: 1,
    pageSize: 5
  })

  console.log(res.total)
  console.log(res.list)
}
```

### POST 示例：提交借阅

```js
import { borrowBook } from '../api/library'

const handleBorrow = async () => {
  const res = await borrowBook({
    bookId: 3,
    userId: 1
  })

  console.log(res.message)
  console.log(res.record)
}
```
