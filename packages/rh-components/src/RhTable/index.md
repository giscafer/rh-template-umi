---
title: RhTable
order: 1
---

# RhTable

用于修改查询条件规范，使用方式和 [ProTable - 高级表格](https://procomponents.ant.design/components/table?current=1&pageSize=5) 一致

- 改造查询条件 UI 交互
- 通用配置统一
- 简化使用
- 虚拟表格（必须设置 scroll.y，如没有使用默认值 600）

精简写法：

```js
// 正常只需要配置这几个属性即可满足要求
<RhTable columns={columns} actionRef={actionRef} request={getList} />
```

## Demo

在线访问： http://components.leekhub.com/components/rh-table
