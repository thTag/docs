import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick, h } from 'vue'
import { useRoute } from 'vitepress'
import GitLastUpdated from './components/GitLastUpdated.vue'
import NotFound from './404-page.vue' // 1. 引入 404 组件
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 2. 使用 not-found 插槽注入你的自定义组件
      'not-found': () => h(NotFound),
      'doc-footer-before': () => h(GitLastUpdated)
    })
  },
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('GitLastUpdated', GitLastUpdated)
  },
  setup() {
    const route = useRoute()

    const initZoom = () => {
      // 为所有图片添加缩放功能
      mediumZoom('.main img', {
        background: 'var(--vp-c-bg)',
        margin: 24
      })
    }

    onMounted(() => {
      initZoom()
    })

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}
