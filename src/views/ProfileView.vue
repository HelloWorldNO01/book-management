<template>
  <section class="page-stack">
    <div class="stats-grid">
      <article class="stat-card">
        <span>当前借阅</span>
        <strong>{{ profile?.stats?.borrowedCount ?? 0 }}</strong>
        <small>未归还图书</small>
      </article>
      <article class="stat-card">
        <span>逾期次数</span>
        <strong>{{ profile?.stats?.overdueCount ?? 0 }}</strong>
        <small>历史逾期统计</small>
      </article>
      <article class="stat-card">
        <span>已归还</span>
        <strong>{{ profile?.stats?.returnedCount ?? 0 }}</strong>
        <small>完成归还记录</small>
      </article>
      <article class="stat-card">
        <span>身份</span>
        <strong>{{ profile?.role || '-' }}</strong>
        <small>{{ profile?.studentId || '暂无学号' }}</small>
      </article>
    </div>

    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>个人资料</h2>
          <p>资料保存后会同步到后端用户档案。</p>
        </div>
      </header>

      <div v-if="loading" class="empty-state">
        <div class="empty-mark">...</div>
        <p>正在加载个人资料</p>
      </div>

      <form v-else class="form-grid two" @submit.prevent="handleSave">
        <label class="field">
          <span>姓名</span>
          <input v-model.trim="form.name" class="input" required />
        </label>

        <label class="field">
          <span>学号</span>
          <input :value="profile?.studentId" class="input" disabled />
        </label>

        <label class="field">
          <span>手机号</span>
          <input v-model.trim="form.phone" class="input" />
        </label>

        <label class="field">
          <span>邮箱</span>
          <input v-model.trim="form.email" class="input" type="email" />
        </label>

        <label class="field full">
          <span>专业</span>
          <input v-model.trim="form.major" class="input" />
        </label>

        <div class="field full">
          <p v-if="message" class="success-line">{{ message }}</p>
          <p v-if="errorMessage" class="error-line">{{ errorMessage }}</p>
          <button class="button button-primary" type="submit" :disabled="saving">
            {{ saving ? '保存中...' : '保存资料' }}
          </button>
        </div>
      </form>
    </section>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getProfile, updateProfile } from '../api/library'
import { useSession } from '../composables/useSession'

const { currentUser, setUser } = useSession()

const profile = ref(null)
const loading = ref(false)
const saving = ref(false)
const message = ref('')
const errorMessage = ref('')

const form = reactive({
  name: '',
  phone: '',
  email: '',
  major: ''
})

const assignProfile = (data) => {
  profile.value = data
  form.name = data.name || ''
  form.phone = data.phone || ''
  form.email = data.email || ''
  form.major = data.major || ''
}

const loadProfile = async () => {
  if (!currentUser.value) return
  loading.value = true

  try {
    assignProfile(await getProfile(currentUser.value.id))
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (!profile.value) return

  saving.value = true
  message.value = ''
  errorMessage.value = ''

  try {
    const result = await updateProfile(profile.value.id, form)
    assignProfile(result.profile)
    setUser({
      ...currentUser.value,
      name: result.profile.name,
      phone: result.profile.phone,
      email: result.profile.email,
      major: result.profile.major
    })
    message.value = result.message || '个人资料更新成功'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>
