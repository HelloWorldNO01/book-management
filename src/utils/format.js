export const statusText = {
  available: '可借',
  unavailable: '不可借',
  borrowed: '借阅中',
  due: '逾期未还',
  returned: '已归还',
  enabled: '启用',
  disabled: '停用'
}

export const formatStatus = (status) => statusText[status] || status || '-'

export const formatDate = (value) => {
  if (!value) return '-'
  return String(value).slice(0, 10)
}

export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '0'
  return Number(value).toLocaleString('zh-CN')
}
