import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick, h } from 'vue'
import { useRoute } from 'vitepress'
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
    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)', margin: 24 })
    }
    onMounted(() => initZoom())
    watch(() => route.path, () => nextTick(() => initZoom()))
  }
}
