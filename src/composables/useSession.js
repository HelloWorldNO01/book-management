import { ref } from 'vue'

const STORAGE_KEY = 'library-user'

const readUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const currentUser = ref(readUser())

export const getStoredUser = () => readUser()

export const useSession = () => {
  const setUser = (user) => {
    currentUser.value = user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }

  const clearUser = () => {
    currentUser.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  const refreshUser = () => {
    currentUser.value = readUser()
    return currentUser.value
  }

  return {
    currentUser,
    setUser,
    clearUser,
    refreshUser
  }
}
