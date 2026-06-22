import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick, h } from 'vue'
import { useRoute, useData } from 'vitepress'
import mermaid from 'mermaid'
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import { NolebaseInlineLinkPreviewPlugin } from '@nolebase/vitepress-plugin-inline-link-preview/client'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

import NotFound from './components/404-page.vue'
import ReadingTime from './components/ReadingTime.vue'

import './custom.css'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
// 注意：样式路径是 /client/style.css，不是 /style.css
import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css'
import '@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
      'doc-before': () => h(ReadingTime),
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
    })
  },
  enhanceApp({ app }) {
    app.use(NolebaseGitChangelogPlugin)
    app.use(NolebaseInlineLinkPreviewPlugin)
    app.component('ReadingTime', ReadingTime)
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
