---
title: RhTable
order: 1
---

# RhTable

基于 [ProTable](https://procomponents.ant.design/components/table?current=1&pageSize=5) 扩展，探索高效研发实践，做到**基本不写**可能重复的代码。基本没机会写 React 的 `tsx` 代码

- ProTable 能做的都有，只做扩展
- 支持原生写法，对齐 ProTable 没有 breaking change
- 扩展 Low-Code 配置化开发，复杂的列表页只需要 100 行代码，可能没有机会写 ReactElement 代码
- 改造查询条件 UI 交互，支持 2+ 种查询布局
- 缓存请求，延迟 loading 增强体验（如非首次渲染，重新请求 300ms 内能拿到数据的话 loading 不显示静默刷新，类似 SWR 和 React Query）
- 虚拟滚动

精简写法：

```js
// 正常只需要配置这几个属性即可满足要求
<RhTable columns={columns} actionRef={actionRef} request={getList} />
```

## Demo

在线访问： http://components.leekhub.com/components/rh-table
