<template>
  <section class="page-stack">
    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>{{ isEdit ? '编辑图书' : '新增图书' }}</h2>
          <p>{{ isEdit ? '更新馆藏基础资料、库存和可借状态。' : '录入新书信息并加入馆藏列表。' }}</p>
        </div>
        <RouterLink class="button button-secondary" to="/books">返回列表</RouterLink>
      </header>

      <form class="form-grid two" @submit.prevent="handleSubmit">
        <label class="field">
          <span>图书名称</span>
          <input v-model.trim="form.title" class="input" required />
        </label>

        <label class="field">
          <span>作者</span>
          <input v-model.trim="form.author" class="input" required />
        </label>

        <label class="field">
          <span>分类</span>
          <select v-model="form.categoryId" class="select" required>
            <option value="" disabled>请选择分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>状态</span>
          <select v-model="form.status" class="select">
            <option value="available">可借</option>
            <option value="unavailable">不可借</option>
          </select>
        </label>

        <label class="field">
          <span>可借库存</span>
          <input v-model.number="form.stock" class="input" min="0" type="number" required />
        </label>

        <label class="field">
          <span>总库存</span>
          <input v-model.number="form.totalStock" class="input" min="0" type="number" required />
        </label>

        <label class="field">
          <span>ISBN</span>
          <input v-model.trim="form.isbn" class="input" />
        </label>

        <label class="field">
          <span>馆藏位置</span>
          <input v-model.trim="form.shelfLocation" class="input" placeholder="例如 B-03-14" />
        </label>

        <label class="field">
          <span>出版社</span>
          <input v-model.trim="form.publisher" class="input" />
        </label>

        <label class="field">
          <span>出版时间</span>
          <input v-model.trim="form.publishDate" class="input" placeholder="例如 2024-03" />
        </label>

        <label class="field full">
          <span>封面地址</span>
          <input v-model.trim="form.cover" class="input" placeholder="可留空，系统会生成馆藏封面" />
        </label>

        <label class="field full">
          <span>简介</span>
          <textarea v-model.trim="form.description" class="textarea"></textarea>
        </label>

        <div class="field full">
          <p v-if="errorMessage" class="error-line">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-line">{{ successMessage }}</p>
          <div class="action-row">
            <button class="button button-primary" type="submit" :disabled="saving">
              {{ saving ? '保存中...' : '保存' }}
            </button>
            <button class="button button-secondary" type="button" @click="fillStatusByStock">按库存同步状态</button>
          </div>
        </div>
      </form>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createBook, getBookDetail, getCategories, updateBook } from '../api/library'

const route = useRoute()
const router = useRouter()

const categories = ref([])
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const isEdit = computed(() => route.name === 'book-edit')

const form = reactive({
  title: '',
  author: '',
  categoryId: '',
  stock: 1,
  totalStock: 1,
  status: 'available',
  description: '',
  isbn: '',
  publisher: '',
  publishDate: '',
  shelfLocation: '',
  cover: ''
})

const assignForm = (book) => {
  Object.assign(form, {
    title: book.title || '',
    author: book.author || '',
    categoryId: book.categoryId || '',
    stock: book.stock ?? 0,
    totalStock: book.totalStock ?? book.stock ?? 0,
    status: book.status || 'available',
    description: book.description || '',
    isbn: book.isbn || '',
    publisher: book.publisher || '',
    publishDate: book.publishDate || '',
    shelfLocation: book.shelfLocation || '',
    cover: book.cover || ''
  })
}

const fillStatusByStock = () => {
  form.status = Number(form.stock) > 0 ? 'available' : 'unavailable'
}

const validateForm = () => {
  if (Number(form.stock) > Number(form.totalStock)) {
    return '可借库存不能大于总库存'
  }

  return ''
}

const handleSubmit = async () => {
  const validationError = validateForm()
  if (validationError) {
    errorMessage.value = validationError
    return
  }

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const payload = { ...form }
    const result = isEdit.value
      ? await updateBook(route.params.id, payload)
      : await createBook(payload)
    const savedBook = result.book || result
    successMessage.value = isEdit.value ? '图书更新成功' : '图书创建成功'
    router.replace(`/books/${savedBook.id}`)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  categories.value = await getCategories()

  if (isEdit.value) {
    const book = await getBookDetail(route.params.id)
    assignForm(book)
  }
})
</script>
