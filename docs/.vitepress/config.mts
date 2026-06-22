import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'

// 引入 Nolebase 视觉增强
// 注意：inline-link-preview 是 markdown-it 插件，从 ./markdown-it 引入，不是 /vite
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
// 注意：highlight-targeted-heading 没有 Vite 插件入口，纯客户端，config 里不需要引入
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img'

// 引入其他功能插件
import llmstxt from 'vitepress-plugin-llms'
// 注意：pagefind 从根路径引入，导出名是小写 pagefindPlugin，不是 /vite
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
import Music from 'vitepress-plugin-music'
import { npm2yarnPlugin } from 'vitepress-plugin-npm2yarn'

// GitHub 头像代理，解决国内无法加载 avatars.githubusercontent.com 的问题
function githubAvatarProxy() {
  return {
    name: 'github-avatar-proxy',
    enforce: 'pre' as const,
    transformIndexHtml(html: string) {
      // 替换 GitHub 头像为代理地址
      return html.replace(
        /https:\/\/avatars\.githubusercontent\.com/g,
        'https://avatar.duishang.cn'
      )
    },
  }
}

export default defineConfig({
  title: "叹号大帝的文档站",
  description: "叹号旗下各类文档和笔记",
  lang: 'zh-CN',
  lastUpdated: false,
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }],
    ['meta', { name: 'theme-color', content: '#f97316' }],
  ],
  sitemap: {
    hostname: 'https://docs.th-dd.top',
  },
  markdown: {
    lineNumbers: true,
    config: (md) => {
      md.use(groupIconMdPlugin)
      md.use(npm2yarnPlugin)
      md.use(UnlazyImages())
      // inline-link-preview 作为 markdown-it 插件挂载
      md.use(InlineLinkPreviewElementTransform)

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
      githubAvatarProxy(),
      groupIconVitePlugin(),
      GitChangelog({
        repoURL: () => 'https://github.com/thTag/docs',
      }),
      GitChangelogMarkdownSection({
        sections: {
          disableContributors: true, // 全局关闭贡献者区块，仅保留页面历史
        },
      }),
      // 注意：inline-link-preview 和 highlight-targeted-heading 不在这里
      llmstxt(),
      pagefindPlugin(),
      Music(),
    ],
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        '@nolebase/vitepress-plugin-inline-link-preview/client',
        'vitepress',
        '@nolebase/ui',
      ],
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-inline-link-preview',
        '@nolebase/vitepress-plugin-highlight-targeted-heading',
        '@nolebase/markdown-it-unlazy-img',
        'vitepress-plugin-llms',
        'vitepress-plugin-pagefind',
        'vitepress-plugin-music',
        'vitepress-plugin-npm2yarn',
        '@nolebase/ui',
      ],
    },
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
          { text: '更新日志', link: '/changelogs' },
          { text: '❤️ 赞助我们', link: '/support' },
        ]
      },
      {
        text: '叹号 Bot',
        items: [
          { text: '简介', link: '/bots/bots' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/thTag/docs' }
    ],
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
