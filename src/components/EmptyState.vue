<template>
  <div class="empty-state">
    <div class="empty-mark">{{ mark }}</div>
    <p>{{ title }}</p>
    <span v-if="description">{{ description }}</span>
  </div>
</template>

<script setup>
defineProps({
  mark: {
    type: String,
    default: '—'
  },
  title: {
    type: String,
    default: '暂无数据'
  },
  description: {
    type: String,
    default: ''
  }
})
</script>
