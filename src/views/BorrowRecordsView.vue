<template>
  <section class="page-stack">
    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>借阅记录筛选</h2>
          <p>查看当前账号的借阅、逾期和已归还记录。</p>
        </div>
      </header>

      <form class="form-grid" @submit.prevent="loadRecords">
        <label class="field">
          <span>状态</span>
          <select v-model="filters.status" class="select">
            <option value="">全部状态</option>
            <option value="borrowed">借阅中</option>
            <option value="due">逾期未还</option>
            <option value="returned">已归还</option>
          </select>
        </label>

        <label class="field">
          <span>开始日期</span>
          <input v-model="filters.startDate" class="input" type="date" />
        </label>

        <label class="field">
          <span>结束日期</span>
          <input v-model="filters.endDate" class="input" type="date" />
        </label>

        <div class="field">
          <span>&nbsp;</span>
          <div class="action-row">
            <button class="button button-primary" type="submit">查询</button>
            <button class="button button-secondary" type="button" @click="resetFilters">重置</button>
          </div>
        </div>
      </form>
    </section>

    <div class="stats-grid">
      <article class="stat-card">
        <span>借阅中</span>
        <strong>{{ summary.borrowed }}</strong>
        <small>当前未归还</small>
      </article>
      <article class="stat-card">
        <span>逾期未还</span>
        <strong>{{ summary.due }}</strong>
        <small>需要尽快归还</small>
      </article>
      <article class="stat-card">
        <span>已归还</span>
        <strong>{{ summary.returned }}</strong>
        <small>历史完成记录</small>
      </article>
      <article class="stat-card">
        <span>总记录</span>
        <strong>{{ records.length }}</strong>
        <small>当前筛选结果</small>
      </article>
    </div>

    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>我的借阅</h2>
          <p>{{ currentUser?.name }} · {{ currentUser?.studentId }}</p>
        </div>
        <RouterLink class="button button-secondary" to="/books">去借书</RouterLink>
      </header>

      <div v-if="loading" class="empty-state">
        <div class="empty-mark">...</div>
        <p>正在加载借阅记录</p>
      </div>

      <div v-else-if="records.length" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>图书</th>
              <th>借阅日期</th>
              <th>应还日期</th>
              <th>归还日期</th>
              <th>状态</th>
              <th class="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.id">
              <td>
                <RouterLink :to="`/books/${record.bookId}`">
                  <strong>{{ record.bookTitle }}</strong>
                </RouterLink>
              </td>
              <td>{{ formatDate(record.borrowDate) }}</td>
              <td>{{ formatDate(record.dueDate) }}</td>
              <td>{{ formatDate(record.returnDate) }}</td>
              <td><StatusBadge :status="record.status" /></td>
              <td class="text-right">
                <button
                  class="table-button"
                  type="button"
                  :disabled="record.status === 'returned' || returningId === record.id"
                  @click="handleReturn(record)"
                >
                  {{ returningId === record.id ? '归还中' : '归还' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState v-else title="暂无借阅记录" description="借阅图书后，记录会显示在这里。" />
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { getBorrowRecords, returnBook } from '../api/library'
import EmptyState from '../components/EmptyState.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useSession } from '../composables/useSession'
import { formatDate } from '../utils/format'

const { currentUser } = useSession()

const records = ref([])
const loading = ref(false)
const returningId = ref(null)

const filters = reactive({
  status: '',
  startDate: '',
  endDate: ''
})

const summary = computed(() => ({
  borrowed: records.value.filter((item) => item.status === 'borrowed').length,
  due: records.value.filter((item) => item.status === 'due').length,
  returned: records.value.filter((item) => item.status === 'returned').length
}))

const loadRecords = async () => {
  if (!currentUser.value) return
  loading.value = true

  try {
    records.value = await getBorrowRecords({
      userId: currentUser.value.id,
      ...filters
    })
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.status = ''
  filters.startDate = ''
  filters.endDate = ''
  loadRecords()
}

const handleReturn = async (record) => {
  if (!window.confirm(`确认归还《${record.bookTitle}》吗？`)) return

  returningId.value = record.id

  try {
    await returnBook({ recordId: record.id })
    await loadRecords()
  } finally {
    returningId.value = null
  }
}

onMounted(loadRecords)
</script>
