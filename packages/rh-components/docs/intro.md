---
title: 简介
order: 1
group:
  path: /
nav:
  title: 文档
  order: 1
  path: /docs
---

## @roothub/components 的理念

在日常开发过程中，积累和沉淀通用组件，共享使用，不重复造轮子

## 参与贡献

我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建 :smiley:：

- 在你的公司或个人项目中使用 [rh.js](https://github.com/RootLinkFE/rh.js)、[@roothub/components](https://www.npmjs.com/package/@roothub/components)。
- 通过 [Issue](https://github.com/RootLinkFE/rh.js/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](https://github.com/RootLinkFE/rh.js/pulls) 改进的代码。

### 脚手架概览

当我们 clone 完项目之后会看到如下的目录结构。

```bash
- .dumi              * dumi 的相关配置，主要是主题等
- .github            * github 的 action 和相关的 issue 配置
- docs               * 存放公用的文档
- packages           * 我们维护的包, 如果你想贡献代码，这里是你最需要关注的
- README.md          * 展示在 github 主页的代码
- tests              * 编写测试用例的地方
- public             * 部署官网所用的静态文件
- scripts            * 开发或者部署所用的脚本
- .prettierrc.js     * prettier 的相关配置
- .eslintrc.js       * eslint 的配置
- .fatherrc.ts       * 编译脚手架的配置
- .umirc.js          * dumi 的核心配置
- webpack.config.js  * 编译 umd 包的配置文件
- jest.config.js     * 测试环境的配置
- lerna.json         * 多包的配置
- package.json       * 项目的配置
- tsconfig.json      * typescript 的配置
- yarn.lock          * 依赖 lock 文件
```

### 源码概览

在 packages 文件夹中包含了我们所有的组件，每个组件一般都有一个 `src`，`package.json` 和 `README.md`。`package.json` 和 `README.md` 可以在新建文件夹后通过执行 `npm run bootstrap` 来生成。

`src` 中就是我们真正的源码，我们约定 `src` 下会有 demos 文件夹里面会存储所有的 demo，并且 `${包名}.md` 的文件用于介绍这个组件，同时引入 demo 和 API 文档。

> 我们使用了 dumi 的语法，要求全部使用外置组件，用 code 引入，调试起来会更加方便。

### 风格指南

我们使用自动化代码格式化软件 [`Prettier`](https://prettier.io/)。 对代码做出更改后，运行 `npm run prettier`。当然我们更推荐 prettier 的插件，随时格式化代码。

> 我们的 CI 会检查代码是否被 prettier，在提交代码前最好执行一下 `npm run prettier`。

之后，`linter` 会捕获代码中可能出现的多数问题。 你可以运行 `npm run lint` 来检查代码风格状态。

不过，`linter` 也有不能搞定的一些风格。如果有些东西不确定，请查看 [Airbnb’s Style Guide](https://github.com/airbnb/javascript) 来指导自己。

### 开发工作流

我们使用了 [monorepo](https://danluu.com/monorepo/) 的方式来管理我们的仓库，仓库中包含多个独立的包，以便于更改可以一起联调，这样可以一起跑测试用例，如果变更出现问题，我们可以很快的定位到问题。

因为使用了 monorepo ,我们要求必须要使用 yarn 来安装依赖。[`workspace`](https://classic.yarnpkg.com/en/docs/workspaces#search) 可以帮助我们在多个包中共享依赖。

安装完成后你可以使用以下命令：

- `yarn start` 预览你的改动
- `yarn lint` 检查代码风格
- `yarn tsc` 检查 TypeScript 是否符合规范
- `yarn test` 测试代码是否可以通过测试用例
- `yarn test:coverage` 测试仓库的测试覆盖率
- `yarn build` 编译当前组件库

我们建议运行 `yarn test` 或前文提及的 linter 以确保你的代码变更有没有影响原有功能，同时保证你写的每行代码都被正确的测试到，不管怎样这样都会提升组件库的整体质量。

如果你增加了一个新功能，请添加测试后再提交 pr，这样我们能确保以后你的代码不出问题。

### 一些约定

> 待补充
