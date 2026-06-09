import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'

export default defineConfig({
  title: "叹号大帝的文档站",
  description: "叹号旗下各类文档和笔记",
  lang: 'zh-CN',
  lastUpdated: false,
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }],
    ['meta', { name: 'theme-color', content: '#f97316' }],
  ],
  markdown: {
    lineNumbers: true,
    config: (md) => {
      md.use(groupIconMdPlugin)
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim() === 'mermaid') {
          return `<div class="mermaid">${token.content}</div>`
        }
        return defaultFence!(tokens, idx, options, env, self)
      }
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin(),
      GitChangelog({
        repoURL: () => 'https://github.com/thTag/docs',
      }),
      GitChangelogMarkdownSection(),
    ],
  },
  themeConfig: {
    logo: '/logo.jpg',
    siteTitle: '叹号大帝',
    nav: [
      { text: '主页', link: '/' },
      { text: '🚀 从这里开始', link: '/guide/start' },
    ],
    sidebar: [
      {
        text: '📖 指南',
        items: [
          { text: '从这里开始', link: '/guide/start' },
          { text: '❤️ 赞助我们', link: '/support' },
        ]
      },
      {
        text: '叹号 Bot',
        items: [
          { text: '简介', link: '/bots/bots' },
          { text: '更新日志', link: '/bots/bots-updates' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/thTag/docs' }
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档...', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换' }
          }
        }
      }
    },
    editLink: {
      pattern: 'https://github.com/thTag/docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    footer: {
      message: '<a href="https://icp.gov.moe/?keyword=20263888" target="_blank">萌ICP备20263888号</a>',
      copyright: 'Copyright © 2026-present 叹号大帝'
    },
    docFooter: { prev: '上一页', next: '下一页' },
    outline: { label: '页面导航' },
    style: './theme/style/custom.css'
  },
})