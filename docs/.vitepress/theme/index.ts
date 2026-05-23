import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick, h } from 'vue'
import { useRoute, useData } from 'vitepress'
import mermaid from 'mermaid' // 引入 mermaid
import GitLastUpdated from './components/GitLastUpdated.vue'
import NotFound from './components/404-page.vue' // 修正路径
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
      'doc-footer-before': () => h(GitLastUpdated)
    })
  },
  enhanceApp({ app }) {
    app.component('GitLastUpdated', GitLastUpdated)
  },
  setup() {
    const route = useRoute()
    const { isDark } = useData()

    // 图片缩放初始化
    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)', margin: 24 })
    }

    // Mermaid 渲染初始化
    const initMermaid = () => {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark.value ? 'dark' : 'default', // 根据站点暗黑模式切换主题
      })
      
      // 查找页面中未渲染的 mermaid 代码块并渲染
      const mermaidElements = document.querySelectorAll('.mermaid:not([data-processed])')
      if (mermaidElements.length > 0) {
        mermaid.run({ nodes: mermaidElements })
      }
    }

    onMounted(() => {
      initZoom()
      initMermaid()
    })

    // 路由切换时重新初始化
    watch(() => route.path, () => nextTick(() => {
      initZoom()
      initMermaid()
    }))

    // 暗黑模式切换时重新渲染 Mermaid (可选，如果你希望图表主题跟随切换)
    watch(() => isDark.value, () => nextTick(() => initMermaid()))
  }
}
