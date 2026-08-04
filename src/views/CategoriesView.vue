<template>
  <section class="page-stack">
    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>{{ editingId ? '编辑分类' : '新增分类' }}</h2>
          <p>维护分类名称、排序值和启停状态。</p>
        </div>
      </header>

      <form class="form-grid" @submit.prevent="handleSubmit">
        <label class="field">
          <span>分类名称</span>
          <input v-model.trim="form.name" class="input" required />
        </label>

        <label class="field">
          <span>排序值</span>
          <input v-model.number="form.sortOrder" class="input" min="0" type="number" required />
        </label>

        <label class="field">
          <span>状态</span>
          <select v-model="form.status" class="select">
            <option value="enabled">启用</option>
            <option value="disabled">停用</option>
          </select>
        </label>

        <div class="field">
          <span>&nbsp;</span>
          <div class="action-row">
            <button class="button button-primary" type="submit" :disabled="saving">
              {{ saving ? '保存中...' : editingId ? '保存修改' : '新增分类' }}
            </button>
            <button v-if="editingId" class="button button-secondary" type="button" @click="resetForm">
              取消编辑
            </button>
          </div>
        </div>
      </form>
    </section>

    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>分类列表</h2>
          <p>分类会影响图书筛选和详情展示。</p>
        </div>
        <button class="button button-secondary" type="button" :disabled="loading" @click="loadCategories">刷新</button>
      </header>

      <div v-if="loading" class="empty-state">
        <div class="empty-mark">...</div>
        <p>正在加载分类</p>
      </div>

      <div v-else-if="categories.length" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>分类名称</th>
              <th>图书数量</th>
              <th>排序值</th>
              <th>状态</th>
              <th>创建时间</th>
              <th class="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td><strong>{{ category.name }}</strong></td>
              <td>{{ category.bookCount }}</td>
              <td>{{ category.sortOrder }}</td>
              <td><StatusBadge :status="category.status" /></td>
              <td>{{ category.createdAt || '-' }}</td>
              <td class="text-right">
                <button class="table-button" type="button" @click="startEdit(category)">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState v-else title="暂无分类" description="新增分类后，图书录入表单就能选择它。" />
    </section>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { createCategory, getCategories, updateCategory } from '../api/library'
import EmptyState from '../components/EmptyState.vue'
import StatusBadge from '../components/StatusBadge.vue'

const categories = ref([])
const loading = ref(false)
const saving = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  sortOrder: 1,
  status: 'enabled'
})

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.sortOrder = Math.max(categories.value.length + 1, 1)
  form.status = 'enabled'
}

const loadCategories = async () => {
  loading.value = true

  try {
    categories.value = await getCategories()
    if (!editingId.value) {
      form.sortOrder = Math.max(categories.value.length + 1, 1)
    }
  } finally {
    loading.value = false
  }
}

const startEdit = (category) => {
  editingId.value = category.id
  form.name = category.name
  form.sortOrder = category.sortOrder
  form.status = category.status
}

const handleSubmit = async () => {
  saving.value = true

  try {
    if (editingId.value) {
      await updateCategory(editingId.value, form)
    } else {
      await createCategory(form)
    }

    await loadCategories()
    resetForm()
  } finally {
    saving.value = false
  }
}

onMounted(loadCategories)
</script>
