---
title: RhTree
sidemenu: false
order: 2
---

# RhTree

基于 antd 的 [Tree](https://ant.design/components/tree-cn/) 组件封装，目的是简洁的代码实现常用树形功能需求，官方支持的特性会保留，扩展支持以下特性：

- 0、官方已有特性，不做任何修改
- 1、简易的数组结构，无需处理树形结构
- 2、可编辑树（树节点 CRUD 功能，`editable={true}`）
- 3、前端关键字节点搜索过滤（`search={true}` 属性控制）
- 4、自定义节点菜单（`menuProps`属性）
- 5、自定义节点图标（iconfont 或 图片文件都可）
- 6、支持下拉树样式快速切换
- 7、自适应高度。`height`不设置时，页面下的树组件自适应高度（弹窗里的树建议设置高度）
- 8、更多功能见 Api 属性定义

在线文档：http://components.leekhub.com/components/rh-tree

## Demo

#### 简单例子

<code src="./demo/simple.tsx">

#### 自定义节点 Icon

<code src="./demo/demo-icon.tsx">

#### 自定义前端搜索

> 除了自带搜索`search={true}`控制外，可以自定义搜索框，举例使用 `RhSearchInput` 组件

<code src="./demo/demo-search.tsx">

#### 自定义菜单

<code src="./demo/demo-menu.tsx">

#### 异步数据加载

<code src="./demo/demo-lazy.tsx">

#### 下拉面板树选择

> 内置 `rh-tree-select-panel` 样式覆盖可自定义下拉树样式

<code src="./demo/demo-selectpanel.tsx">

#### 复杂可编辑树

<code src="./demo/complex.tsx">

<!-- API属性定义 -->
<API src="./type.ts">
