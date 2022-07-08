import { defineConfig } from 'dumi';
// import commonjs from '@rollup/plugin-commonjs';

// more config: https://d.umijs.org/config
export default defineConfig({
  title: 'RhComponents',
  favicon:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
  logo: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
  outputPath: 'docs-dist',
  mode: 'site',
  styles: ['https://cdn.staticfile.org/antd/4.16.11/antd.min.css'],
  // 单语言配置方式如下
  navs: [
    null,
    {
      title: '脚手架',
      // 可通过如下形式嵌套二级导航菜单，目前暂不支持更多层级嵌套：
      children: [
        { title: 'rh.js', path: 'https://github.com/RootLinkFE/rh.js' },
        {
          title: 'rh-template-react-umi',
          path: 'https://github.com/RootLinkFE/rh-template-react-umi',
        },
      ],
    },
    {
      title: 'GitHub',
      path: 'https://github.com/RootLinkFE/rh.js',
    },
  ],
  plugins: ['@rollup/plugin-commonjs'],
  metas: [
    {
      property: 'og:site_name',
      content: 'RhComponents',
    },
    {
      property: 'og:description',
      content: '🏆 让中后台开发更简单',
    },
    {
      name: 'keywords',
      content: '中后台,admin,Ant Design,ant design,Table,react,roothub',
    },
    {
      name: 'description',
      content: '🏆 让中后台开发更简单 包含 table form 等多个组件。',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent',
    },
    {
      name: 'theme-color',
      content: '#1890ff',
    },
  ],
});
