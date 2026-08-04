<template>

  <router-view/>

</template>

<style scoped>

  main{
    height: 100vh;
    display: flex;
  }



</style>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useSession } from './composables/useSession'

const route = useRoute()
const router = useRouter()
const { currentUser, clearUser } = useSession()

const navItems = [
  {
    to: '/dashboard',
    label: '首页控制台',
    icon: 'M4 13h7V4H4v9Zm2-2V6h3v5H6Zm7 9h7V4h-7v16Zm2-2V6h3v12h-3ZM4 20h7v-5H4v5Zm2-2v-1h3v1H6Z'
  },
  {
    to: '/books',
    label: '图书列表',
    icon: 'M5 4.75A2.75 2.75 0 0 1 7.75 2H19v17.25h-9.7A2.3 2.3 0 0 0 7 21.55V22H5V4.75Zm2.75-.75A.75.75 0 0 0 7 4.75v12.72a4.25 4.25 0 0 1 2.3-.67H17V4H7.75Z'
  },
  {
    to: '/borrows',
    label: '我的借阅',
    icon: 'M7 3h10a2 2 0 0 1 2 2v15.2l-7-3-7 3V5a2 2 0 0 1 2-2Zm0 2v12.15l5-2.14 5 2.14V5H7Zm2 3h6v2H9V8Z'
  },
  {
    to: '/borrow-desk',
    label: '借阅办理',
    icon: 'M4 5h16v4H4V5Zm2 2h12V7H6Zm-1 4h14v8H5v-8Zm2 2v4h10v-4H7Zm3 1h4v2h-4v-2Z'
  },
  {
    to: '/categories',
    label: '分类管理',
    icon: 'M4 5h7v6H4V5Zm2 2v2h3V7H6Zm7-2h7v6h-7V5Zm2 2v2h3V7h-3ZM4 13h7v6H4v-6Zm2 2v2h3v-2H6Zm7-2h7v6h-7v-6Zm2 2v2h3v-2h-3Z'
  },
  {
    to: '/profile',
    label: '个人中心',
    icon: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm-8 11a8 8 0 0 1 16 0h-2a6 6 0 0 0-12 0H4Z'
  }
]

const isLoginPage = computed(() => route.name === 'login')

const handleLogout = () => {
  clearUser()
  router.push({ name: 'login' })
}
</script>
