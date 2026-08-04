import { createRouter, createWebHistory } from 'vue-router'
import { getStoredUser } from '../composables/useSession'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '登录' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
