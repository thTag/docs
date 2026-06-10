<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const readingTime = computed(() => {
  const content = page.value.content || ''
  // 中文按字数算，英文按单词算
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
  const totalWords = chineseChars + englishWords
  // 中文约 400 字/分钟，英文约 200 词/分钟，取平均 300
  const minutes = Math.max(1, Math.ceil(totalWords / 300))
  return minutes
})
</script>

<template>
  <div v-if="readingTime > 0" class="reading-time">
    📖 预计阅读 {{ readingTime }} 分钟
  </div>
</template>

<style scoped>
.reading-time {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
</style>