<template>
  <section class="page-stack">
    <div class="content-grid">
      <section class="panel">
        <header class="panel-header">
          <div>
            <h2>学生查询</h2>
            <p>先确认学生身份和剩余可借额度。</p>
          </div>
        </header>

        <form class="form-grid two" @submit.prevent="loadStudent">
          <label class="field">
            <span>学号</span>
            <input v-model.trim="studentId" class="input" placeholder="20230001" required />
          </label>
          <div class="field">
            <span>&nbsp;</span>
            <button class="button button-primary" type="submit" :disabled="loadingStudent">
              {{ loadingStudent ? '查询中...' : '查询学生' }}
            </button>
          </div>
        </form>

        <div v-if="student" class="detail-list" style="margin-top: 16px;">
          <div class="detail-item">
            <span>姓名</span>
            <strong>{{ student.name }}</strong>
          </div>
          <div class="detail-item">
            <span>学号</span>
            <strong>{{ student.studentId }}</strong>
          </div>
          <div class="detail-item">
            <span>当前借阅</span>
            <strong>{{ student.currentBorrowed }}</strong>
          </div>
          <div class="detail-item">
            <span>剩余额度</span>
            <strong>{{ student.remainingQuota }}</strong>
          </div>
        </div>

        <p v-if="studentError" class="error-line" style="margin-top: 16px;">{{ studentError }}</p>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div>
            <h2>提交借阅</h2>
            <p>选择可借图书后完成办理。</p>
          </div>
        </header>

        <div v-if="selectedBook" class="reminder-item">
          <div>
            <strong>{{ selectedBook.title }}</strong>
            <p class="section-note">{{ selectedBook.author }} · 库存 {{ selectedBook.stock }}</p>
          </div>
          <button class="table-button danger" type="button" @click="selectedBook = null">移除</button>
        </div>
        <EmptyState v-else mark="+" title="尚未选择图书" description="从下方搜索结果中选择一本可借图书。" />

        <p v-if="message" class="success-line" style="margin-top: 12px;">{{ message }}</p>
        <p v-if="borrowError" class="error-line" style="margin-top: 12px;">{{ borrowError }}</p>

        <button
          class="button button-primary"
          type="button"
          style="margin-top: 12px; width: 100%;"
          :disabled="!canSubmit || borrowing"
          @click="handleBorrow"
        >
          {{ borrowing ? '办理中...' : '确认借阅' }}
        </button>
      </section>
    </div>

    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>可借图书搜索</h2>
          <p>只展示状态为可借且库存大于 0 的图书。</p>
        </div>
      </header>

      <form class="form-grid three" @submit.prevent="loadBooks">
        <label class="field">
          <span>关键词</span>
          <input v-model.trim="bookFilters.keyword" class="input" placeholder="书名或作者" />
        </label>
        <label class="field">
          <span>分类</span>
          <select v-model="bookFilters.categoryId" class="select">
            <option value="">全部分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </label>
        <div class="field">
          <span>&nbsp;</span>
          <button class="button button-primary" type="submit" :disabled="loadingBooks">搜索图书</button>
        </div>
      </form>

      <div v-if="loadingBooks" class="empty-state" style="margin-top: 16px;">
        <div class="empty-mark">...</div>
        <p>正在查询可借图书</p>
      </div>

      <div v-else-if="books.length" class="book-grid" style="margin-top: 16px;">
        <article v-for="book in books" :key="book.id" class="book-card">
          <BookCover
            :title="book.title"
            :author="book.author"
            :cover="book.cover"
            :category-name="book.categoryName"
            :seed="book.id"
          />
          <div>
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }} · {{ book.categoryName }}</p>
            <div class="action-row">
              <span class="status-badge status-available">库存 {{ book.stock }}</span>
              <button class="table-button" type="button" @click="selectedBook = book">选择</button>
            </div>
          </div>
        </article>
      </div>

      <EmptyState v-else title="没有可借图书" description="尝试换一个关键词或分类。" style="margin-top: 16px;" />
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { borrowBook, getBookList, getCategories, getUserByStudentId } from '../api/library'
import BookCover from '../components/BookCover.vue'
import EmptyState from '../components/EmptyState.vue'

const studentId = ref('20230001')
const student = ref(null)
const selectedBook = ref(null)
const books = ref([])
const categories = ref([])
const loadingStudent = ref(false)
const loadingBooks = ref(false)
const borrowing = ref(false)
const studentError = ref('')
const borrowError = ref('')
const message = ref('')

const bookFilters = reactive({
  keyword: '',
  categoryId: '',
  page: 1,
  pageSize: 12
})

const canSubmit = computed(
  () => student.value && selectedBook.value && Number(student.value.remainingQuota) > 0 && Number(selectedBook.value.stock) > 0
)

const loadStudent = async () => {
  loadingStudent.value = true
  studentError.value = ''
  message.value = ''

  try {
    student.value = await getUserByStudentId(studentId.value)
  } catch (error) {
    student.value = null
    studentError.value = error.message
  } finally {
    loadingStudent.value = false
  }
}

const loadBooks = async () => {
  loadingBooks.value = true

  try {
    const data = await getBookList({
      ...bookFilters,
      status: 'available'
    })
    books.value = (data.list || []).filter((book) => Number(book.stock) > 0)
  } finally {
    loadingBooks.value = false
  }
}

const handleBorrow = async () => {
  borrowing.value = true
  borrowError.value = ''
  message.value = ''

  try {
    const result = await borrowBook({
      userId: student.value.id,
      bookId: selectedBook.value.id
    })
    message.value = result.message
    selectedBook.value = null
    await Promise.all([loadStudent(), loadBooks()])
  } catch (error) {
    borrowError.value = error.message
  } finally {
    borrowing.value = false
  }
}

onMounted(async () => {
  categories.value = await getCategories()
  await Promise.all([loadStudent(), loadBooks()])
})
</script>
