<template>
  <span class="status-badge" :class="`status-${status || 'default'}`">
    {{ formatStatus(status) }}
  </span>
</template>

<script setup>
import { formatStatus } from '../utils/format'

defineProps({
  status: {
    type: String,
    default: ''
  }
})
</script>
