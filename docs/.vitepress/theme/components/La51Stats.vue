<script setup lang="ts">
/**
 * ============================================================
 * 51.la 网站统计数据展示组件
 * ============================================================
 *
 * 功能说明：
 *   在页面上展示 51.la 统计的实时数据（PV/UV 等），
 *   数据通过 51.la 官方提供的 widget 脚本异步加载。
 *
 * 使用方式：
 *   在任意 Markdown 页面或 Vue 组件中引入：
 *   <La51Stats />
 *
 * 如何移除此功能：
 *   1. 删除本文件：docs/.vitepress/theme/components/La51Stats.vue
 *   2. 删除 start.md（或其他页面）中对 <La51Stats /> 的引用
 *   3. 如需彻底移除 51.la，还需删除 config.mts 中的 La51Plugin 配置
 *
 * 如何修改参数：
 *   修改下方 WIDGET_SRC 常量中的 URL 参数即可，
 *   参数说明见下方注释。
 * ============================================================
 */

/**
 * 51.la Widget 脚本地址
 *
 * URL 参数说明（问号后的部分）：
 *   - theme:  7个颜色值，用逗号分隔，依次为：
 *             主色, 标题文字色, 次要文字色, 数据文字色, 背景色, 边框/强调色, 字号
 *             示例: #1690FF,#333333,#999999,#333333,#FFFFFF,#1690FF,14
 *   - col:    是否显示列名 (true/false)
 *   - f:      字体大小 (数字)
 *   - badge:  徽标图标样式 (如 icon_0, icon_1 ...)
 *   - icon:   图标位置 (如 center, left, right)
 *
 * URL 路径中的 ID（3Qh7e1TTr9mNqdFF）是你的 51.la 站点 ID，
 * 如需更换站点，替换路径中的 ID 即可。
 */
const WIDGET_SRC =
  'https://v6-widget.51.la/v6/3Qh7e1TTr9mNqdFF/quote.js?theme=#1690FF,#333333,#999999,#333333,#FFFFFF,#1690FF,14&col=true&f=14&badge=icon_0&icon=center'

/**
 * 组件挂载时动态注入 51.la widget 脚本
 * 脚本会自动在容器内渲染统计数据卡片
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'

const scriptEl = ref<HTMLScriptElement | null>(null)

onMounted(() => {
  // 创建 script 标签
  const script = document.createElement('script')
  script.id = 'LA-DATA-WIDGET'
  script.crossOrigin = 'anonymous'
  script.charset = 'UTF-8'
  script.src = WIDGET_SRC
  // 将脚本插入到组件容器中，51.la 会在此处渲染数据
  const container = document.getElementById('la-stats-container')
  if (container) {
    container.appendChild(script)
    scriptEl.value = script
  }
})

// 组件卸载时清理脚本，避免重复注入
onBeforeUnmount(() => {
  if (scriptEl.value && scriptEl.value.parentNode) {
    scriptEl.value.parentNode.removeChild(scriptEl.value)
  }
})
</script>

<template>
  <!-- 51.la 统计数据渲染容器 -->
  <div class="la-stats-wrapper">
    <div id="la-stats-container" class="la-stats-container"></div>
  </div>
</template>

<style scoped>
/* 统计数据外层容器，可在此调整间距、对齐等 */
.la-stats-wrapper {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

/* 51.la 脚本渲染内容的容器 */
.la-stats-container {
  width: 100%;
  min-height: 60px;
}

/* 暗色模式下的微调（可选） */
:deep(.la-widget) {
  background: transparent !important;
}
</style>
