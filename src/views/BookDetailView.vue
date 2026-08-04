<template>
  <section class="page-stack">
    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>{{ book?.title || '图书详情' }}</h2>
          <p>{{ book?.author || '正在读取图书信息' }}</p>
        </div>
        <div class="action-row">
          <RouterLink class="button button-secondary" to="/books">返回列表</RouterLink>
          <RouterLink v-if="book" class="button button-secondary" :to="`/books/${book.id}/edit`">编辑</RouterLink>
          <button class="button button-primary" type="button" :disabled="!canBorrow || borrowing" @click="handleBorrow">
            {{ borrowing ? '办理中...' : '立即借阅' }}
          </button>
        </div>
      </header>

      <div v-if="loading" class="empty-state">
        <div class="empty-mark">...</div>
        <p>正在加载详情</p>
      </div>

      <div v-else-if="book" class="detail-layout">
        <BookCover
          class="large"
          :title="book.title"
          :author="book.author"
          :cover="book.cover"
          :category-name="book.categoryName"
          :seed="book.id"
        />

        <div class="page-stack">
          <div class="detail-list">
            <div class="detail-item">
              <span>分类</span>
              <strong>{{ book.categoryName }}</strong>
            </div>
            <div class="detail-item">
              <span>状态</span>
              <StatusBadge :status="book.status" />
            </div>
            <div class="detail-item">
              <span>库存</span>
              <strong>{{ book.stock }} / {{ book.totalStock }}</strong>
            </div>
            <div class="detail-item">
              <span>馆藏位置</span>
              <strong>{{ book.shelfLocation || '-' }}</strong>
            </div>
            <div class="detail-item">
              <span>ISBN</span>
              <strong>{{ book.isbn || '-' }}</strong>
            </div>
            <div class="detail-item">
              <span>出版社 / 出版时间</span>
              <strong>{{ book.publisher || '-' }} · {{ book.publishDate || '-' }}</strong>
            </div>
          </div>

          <section class="detail-item">
            <span>图书简介</span>
            <strong>{{ book.description || '暂无简介。' }}</strong>
            <p v-if="message" class="success-line">{{ message }}</p>
            <p v-if="errorMessage" class="error-line">{{ errorMessage }}</p>
          </section>
        </div>
      </div>

      <EmptyState v-else title="图书不存在" description="请返回列表重新选择图书。" />
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { borrowBook, getBookDetail } from '../api/library'
import BookCover from '../components/BookCover.vue'
import EmptyState from '../components/EmptyState.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useSession } from '../composables/useSession'

const route = useRoute()
const { currentUser } = useSession()

const book = ref(null)
const loading = ref(false)
const borrowing = ref(false)
const message = ref('')
const errorMessage = ref('')

const canBorrow = computed(() => book.value && book.value.status === 'available' && Number(book.value.stock) > 0)

const loadBook = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    book.value = await getBookDetail(route.params.id)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

const handleBorrow = async () => {
  if (!canBorrow.value || !currentUser.value) return

  borrowing.value = true
  message.value = ''
  errorMessage.value = ''

  try {
    const result = await borrowBook({
      bookId: book.value.id,
      userId: currentUser.value.id
    })
    message.value = result.message
    await loadBook()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    borrowing.value = false
  }
}

onMounted(loadBook)
</script>
