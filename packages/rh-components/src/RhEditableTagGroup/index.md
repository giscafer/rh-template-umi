---
title: EditableTagGroup
nav:
  title: 'Components'
  path: /components
group:
  title: '数据展示'
---

## RhEditableTagGroup

可编辑标签组

同时推荐：[react-tag-input](https://github.com/pathofdev/react-tag-input)

## Demo

#### 可编辑

<code src="./demos/demo1.tsx">

#### 不可编辑

<code src="./demos/demo2.tsx">
<code src="./demos/demo3.tsx">

### API

| 参数             | 说明                                 | 类型                        | 默认值     |
| ---------------- | ------------------------------------ | --------------------------- | ---------- |
| value            | 标签数组                             | `string[]`                  | `[]`       |
| disabled         | 是否禁用                             | `boolean`                   | `false`    |
| showButton       | disabled 为 true 时，是否显示按钮    | `boolean`                   | `false`    |
| maxLength        | 最多标签数量                         | `number`                    | `Infinity` |
| InputMaxLength   | 输入框最大长度                       | `number`                    | `Infinity` |
| displayMaxLength | 单个标签展示最大长度，超出显示省略号 | `number`                    | `20`       |
| onChange         | 内存记录改变回调                     | `(value: string[]) => void` | -          |
