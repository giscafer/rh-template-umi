# rh-template-umi

基于 Umi 的中后台工程脚手架，在线预览：https://rh-umi.vercel.app

![](./demo.png)

## 技术栈

- Umi 4.x ([Umi Max 简介](https://next.umijs.org/zh-CN/docs/max/introduce))
- React18 + TypeScript + RxJS

## 功能特点

- 自定义 Sidebar 菜单
- 内置常用组件
- Antd 样式覆写
  <!-- - Swagger Doc Api TypeScript 接口代码生成 -->
  <!-- - 主题换色 -->

yarn workspaces （[文章介绍](https://juejin.cn/post/7011024137707585544))

```json
{
  "@roothub/components": {
    "location": "packages/rh-components",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": ["@roothub/helper/src"]
  },
  "@roothub/helper/src": {
    "location": "packages/rh-helper",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  }
}
```

## TODO

> RxJS 相关的使用封装，要做到心智成本低，易上手易维护，使用者可以不懂 RxJS，可提供写法方案但可以选择不写

- [x] yarn workspaces 组件库和共享库
- [x] 配置化表格开发封装
- [x] 表格数据共享通信方案
- [ ] 动态表单(WIP)
- [ ] RxJS 封装全局数据状态管理
- [ ] 高效中后台前端开发方案

## 使用说明

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn dev
```

## License

MIT author[@giscafer](https://giscafer.com)
