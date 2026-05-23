import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { execSync } from 'child_process'
import { resolve } from 'path'

// 获取文件的 git 信息
function getGitInfo(filePath: string) {
  try {
    const cwd = process.cwd()
    const fullPath = resolve(cwd, 'docs', filePath)
    
    const author = execSync(
      `git log -1 --format="%an" -- "${fullPath}"`,
      { encoding: 'utf-8', cwd }
    ).trim()
    
    const date = execSync(
      `git log -1 --format="%ci" -- "${fullPath}"`,
      { encoding: 'utf-8', cwd }
    ).trim()
    
    const hash = execSync(
      `git log -1 --format="%H" -- "${fullPath}"`,
      { encoding: 'utf-8', cwd }
    ).trim()
    
    return { author, date, hash }
  } catch (e) {
    return { author: 'Unknown', date: '', hash: '' }
  }
}

export default withMermaid(
  defineConfig({
    title: "叹号大帝的文档站",
    description: "叹号旗下各类文档和笔记",
    lang: 'zh-CN',
    lastUpdated: false, // 禁用默认的 lastUpdated，使用自定义组件
    head: [
      ['link', { rel: 'icon', href: '/logo.jpg' }],
      ['meta', { name: 'theme-color', content: '#f97316' }],
    ],
    // Markdown 配置
    markdown: {
      lineNumbers: true,
      config: (md) => {
        md.use(groupIconMdPlugin)
      },
    },
    // Vite 配置
    vite: {
      plugins: [
        groupIconVitePlugin(),
      ],
    },
    // 处理页面数据，添加 git 信息
    transformPageData(pageData) {
      const filePath = pageData.relativePath
      if (filePath) {
        const gitInfo = getGitInfo(filePath)
        pageData.frontmatter.gitAuthor = gitInfo.author
        pageData.frontmatter.gitDate = gitInfo.date
        pageData.frontmatter.gitHash = gitInfo.hash
      }
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
            { text: '❤️ 赞助我们', link: '/Support' },
          ]
        },
        {
          text: '🤖 叹号 Bot',
          items: [
            { text: 'Bot 简介', link: '/bots/bots' },
            { text: '更新日志', link: '/bots/bots-updates' },
          ]
        }
      ],
      socialLinks: [
        { icon: 'github', link: 'https://github.com/th-dd/thdd-docs' }
      ],
      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索文档...',
              buttonAriaLabel: '搜索文档'
            },
            modal: {
              noResultsText: '无法找到相关结果',
              resetButtonTitle: '清除查询条件',
              footer: {
                selectText: '选择',
                navigateText: '切换'
              }
            }
          }
        }
      },
      editLink: {
        pattern: 'https://github.com/th-dd/thdd-docs/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页'
      },
      footer: {
        message: '<a href="https://icp.gov.moe/?keyword=20263888" target="_blank">萌ICP备20263888号</a>',
        copyright: 'Copyright © 2026-present 叹号大帝'
      },
      docFooter: {
        prev: '上一页',
        next: '下一页'
      },
      outline: {
        label: '页面导航'
      },
      // 添加字体配置
      style: './theme/style/custom.css'
    },
    // Mermaid 配置
    mermaid: {
      theme: 'default',
    },
    mermaidPlugin: {
      class: 'mermaid',
    }
  })
)