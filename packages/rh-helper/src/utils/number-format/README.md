# number-format

将数字格式化为文本。

## 🔨 使用

```ts
import numberFormat from '@utils/number-format';

// 直接使用
numberFormat().format(123456);
// >> 123,456

// 不使用千分符
numberFormat({ thousandSeparator: false }).format(123456);
// >> 123456

// 添加前缀
numberFormat({ prefix: '$' }).format(123456);
// >> $123,456

// 添加后缀
numberFormat({ suffix: '/100' }).format(98);
// >> 98/100

// 格式化
numberFormat({ template: '## [##] ##' }).format(123456);
// >> 12 [34] 56
```

### 参数

| 参数名            | 类型                  | 默认值 | 描述                                |
| ----------------- | --------------------- | ------ | ----------------------------------- |
| prefix            | `string`              | --     | 设置数值的前缀                      |
| suffix            | `string`              | --     | 设置数值的后缀                      |
| thousandSeparator | `boolean` \| `string` | `true` | 设置千分位分隔符, `true` 默认为 `,` |
| decimalSeparator  | `string`              | `.`    | 设置小数点                          |
| precision         | `number`              | `true` | 数值精度                            |
| template          | `string`              | --     | 格式化的模板, 使用`#`占位           |
