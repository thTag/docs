import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick, h } from 'vue'
import { useRoute, useData } from 'vitepress'
import mermaid from 'mermaid'
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import NotFound from './components/404-page.vue'
import './custom.css'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
    })
  },
  enhanceApp({ app }) {
    app.use(NolebaseGitChangelogPlugin)
  },
  setup() {
    const route = useRoute()
    const { isDark } = useData()

    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)', margin: 24 })
    }

    const initMermaid = () => {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark.value ? 'dark' : 'default',
      })
      const mermaidElements = document.querySelectorAll('.mermaid:not([data-processed])')
      if (mermaidElements.length > 0) {
        mermaid.run({ nodes: mermaidElements })
      }
    }

    onMounted(() => {
      initZoom()
      initMermaid()
    })

    watch(() => route.path, () => nextTick(() => {
      initZoom()
      initMermaid()
    }))

    watch(() => isDark.value, () => nextTick(() => initMermaid()))
  }
}