<template>
  <section class="page-stack">
    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>馆藏检索</h2>
          <p>按书名、作者、分类和可借状态组合查询。</p>
        </div>
        <RouterLink class="button button-primary" to="/books/new">+ 新增图书</RouterLink>
      </header>

      <form class="form-grid" @submit.prevent="handleSearch">
        <label class="field">
          <span>关键词</span>
          <input v-model.trim="filters.keyword" class="input" placeholder="书名或作者" />
        </label>

        <label class="field">
          <span>分类</span>
          <select v-model="filters.categoryId" class="select">
            <option value="">全部分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>状态</span>
          <select v-model="filters.status" class="select">
            <option value="">全部状态</option>
            <option value="available">可借</option>
            <option value="unavailable">不可借</option>
          </select>
        </label>

        <div class="field">
          <span>&nbsp;</span>
          <div class="action-row">
            <button class="button button-primary" type="submit">搜索</button>
            <button class="button button-secondary" type="button" @click="resetFilters">重置</button>
          </div>
        </div>
      </form>
    </section>

    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>图书列表</h2>
          <p>共 {{ total }} 本，当前第 {{ filters.page }} 页。</p>
        </div>
        <button class="button button-secondary" type="button" :disabled="loading" @click="loadBooks">刷新</button>
      </header>

      <div v-if="loading" class="empty-state">
        <div class="empty-mark">...</div>
        <p>正在查询图书</p>
      </div>

      <template v-else-if="books.length">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>图书</th>
                <th>分类</th>
                <th>库存</th>
                <th>馆藏位置</th>
                <th>状态</th>
                <th class="text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books" :key="book.id">
                <td>
                  <RouterLink class="book-title-cell" :to="`/books/${book.id}`">
                    <BookCover
                      :title="book.title"
                      :author="book.author"
                      :cover="book.cover"
                      :category-name="book.categoryName"
                      :seed="book.id"
                    />
                    <span>
                      <strong>{{ book.title }}</strong>
                      <small class="muted">{{ book.author }} · {{ book.publisher || '出版社待补充' }}</small>
                    </span>
                  </RouterLink>
                </td>
                <td>{{ book.categoryName }}</td>
                <td>{{ book.stock }} / {{ book.totalStock }}</td>
                <td>{{ book.shelfLocation || '-' }}</td>
                <td><StatusBadge :status="book.status" /></td>
                <td class="text-right">
                  <RouterLink class="table-button" :to="`/books/${book.id}`">详情</RouterLink>
                  <RouterLink class="table-button" :to="`/books/${book.id}/edit`">编辑</RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button class="button button-secondary" type="button" :disabled="filters.page <= 1" @click="changePage(-1)">
            上一页
          </button>
          <span class="muted">第 {{ filters.page }} / {{ pageCount }} 页</span>
          <button class="button button-secondary" type="button" :disabled="filters.page >= pageCount" @click="changePage(1)">
            下一页
          </button>
        </div>
      </template>

      <EmptyState v-else title="没有找到图书" description="调整筛选条件，或新增一本图书。" />
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { getBookList, getCategories } from '../api/library'
import BookCover from '../components/BookCover.vue'
import EmptyState from '../components/EmptyState.vue'
import StatusBadge from '../components/StatusBadge.vue'

const categories = ref([])
const books = ref([])
const total = ref(0)
const loading = ref(false)

const filters = reactive({
  keyword: '',
  categoryId: '',
  status: '',
  page: 1,
  pageSize: 6
})

const pageCount = computed(() => Math.max(Math.ceil(total.value / filters.pageSize), 1))

const loadCategories = async () => {
  categories.value = await getCategories()
}

const loadBooks = async () => {
  loading.value = true

  try {
    const data = await getBookList(filters)
    books.value = data.list || []
    total.value = data.total || 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  filters.page = 1
  loadBooks()
}

const resetFilters = () => {
  filters.keyword = ''
  filters.categoryId = ''
  filters.status = ''
  filters.page = 1
  loadBooks()
}

const changePage = (step) => {
  filters.page = Math.min(Math.max(filters.page + step, 1), pageCount.value)
  loadBooks()
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadBooks()])
})
</script>
