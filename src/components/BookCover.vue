<template>
  <div class="book-cover" :class="`cover-${variant}`">
    <img v-if="cover" :src="cover" :alt="title" />
    <template v-else>
      <span>{{ categoryName || '馆藏' }}</span>
      <strong>{{ title || '未命名图书' }}</strong>
      <small>{{ author || '作者待补充' }}</small>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cover: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  categoryName: {
    type: String,
    default: ''
  },
  seed: {
    type: [String, Number],
    default: 1
  }
})

const variant = computed(() => (Number(props.seed) % 5) + 1)
</script>
