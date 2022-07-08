# RhDynamicToolkit

## 动态渲染 Toolkit

- form 表单支持
  - [x] draw form
  - [x] modal form
  - [x] complex custom form
- [ ] table

## 表单动态表单 jsonSchema 说明

`./demo/*.json` 为动态表单 jsonSchema 文件样例

### 属性说明

| 属性名称         | 描述                                                                 |                   举例                   | 是否必须 |
| ---------------- | :------------------------------------------------------------------- | :--------------------------------------: | :------: |
| id               | 表单字段名称                                                         |               `authority`                |   `是`   |
| label            | 表单 label/title（一般为字段含义的翻译）                             |                `读写类型`                |   `是`   |
| placeholder      | 输入或选择提示                                                       |              `0/1，默认值0`              |   `否`   |
| dataType         | 数据类型 （见下边 dataType 说明）                                    |                 `string`                 |   `是`   |
| defaultValue     | 默认值 `1`                                                           |                   `否`                   |
| required         | 是否必填 （可选`true`、`false`）                                     |                  `true`                  |   `否`   |
| renderType       | 渲染组件类型（组件渲染类型见下边说明，不填则默认渲染为文本输入框）   |                 `radio`                  |   `否`   |
| valueEnum        | 数据类型 （仅当 renderType 为 `select`、`radio`、`checkbox` 时必填） | ` [{ "label": "读写", "value": "All" }]` |    -     |
| validator        | 表单校验规则配置                                                     |          `[{"range":[0,9999]}]`          |   `否`   |
| dependencies     | 表单联动依赖规则，支持联动数据渲染、显示隐藏控制                     |               `见下边举例`               |   `是`   |
| displayFormatter | 输入框值的展示时格式转换函数 （数据库的值在前端展示之前需要转换）    |            `"${value/1000}"`             |   `否`   |
| submitFormatter  | 输入框值的最终格式转换函数（目的是转换成接口格式）                   |            `"${value*1000}"`             |   `否`   |

> displayFormatter 和 submitFormatter 一般同时存在，比如数据库保存的毫秒，但是产品 UI 需要展示的是秒，需要转换。回显时需要 displayFormatter 处理，保存时需要 submitFormatter 处理。

#### 数据类型 dataType

- string 字符串
- int 整数
- float 浮点数
- boolean 布尔值

> 在前端，int、和 float 都为 number 类型，不影响

#### 组件渲染类型 renderType

- input 文本输入框
- select 下拉选择框
- checkbox 多选框
- radio 单选框
- date 日期选择框
- dateRange 日期段选择框（开始日期和结束日期）
- button 按钮

#### 表单验证 validator 规则

`validator` 是个 数组，数组中每一项为一个对象，对象中的属性名称为可以是下面的任意一个，对象中还有一个 `message` 属性，用于描述错误信息。都有默认错误信息模版，满足可以不填，**但建议正则表达式填写错误提示信息，以便用户可以明确知道真正的输入格式。**

- pattern 正则表达式（默认错误信息为：`格式不正确`）
- range 数值区间（默认错误信息为：`请输入${range[0]}~${range[1]}之间的数字`）
- maxLength 文本最大长度（默认错误信息为：`请输入${maxLength}个字符以内`）
- min 数值最小值（默认错误信息为：`请输入大于等于${min}的数字`）
- max 数值最大值（默认错误信息为：`请输入小于等于${max}的数字`）
- expression 表达式验证器 （无默认错误信息，建议配置 `message` 字段）

举例：

> 建议在正则校验规则里通过 `message` 自定义提示，才能让用户明确清楚要怎么填，否则只能提示默认模版的`格式不正确`

```json
{
  "validator": [
    {
      "type": "pattern",
      "value": "^[a-zA-Z_]w*$",
      "message": "只能输入字母、数字和下划线，不能以数字开头"
    },
    // 支持多种规则，但如果有一种能验证完就用一种就好
    { "type": "maxLength", "value": 15 }
  ]
}
```

`expression` 表达式验证器，支持用模版 `${数学表达式}` 来验证表单；程序内置了强大的表达式引擎，详细见文档：[表达式](./docs/expression.md)

```json
{
  "validator": [
    {
      "type": "expression",
      "value": "${collection.offset+value<=16}",
      "message": "位偏移与位长度之和不能超过16"
    }
  ]
}
```

### 一个受联动限制的 select 输入框表单 json 举例

> 该 select 表单字段为 `authority`，受两个字段`registerType`（控制数据联动）和`valueType`（控制显示隐藏）联动控制

```js
{
      "id": "authority",
      "label": "读写类型",
      "dataType": "string",
      "renderType": "radio",
      "required": true,
      "valueEnum": [
        {
          "label": "读写",
          "value": "All"
        },
        {
          "label": "只读",
          "value": "Read"
        },
        {
          "label": "只写",
          "value": "Write"
        }
      ],
      "dependencies": [  // dependencies 表示 依赖的联动字段，是一个数组，多个相关字段联动规则配置

        {   
          "fieldName": "valueType",    // fieldName 指 依赖的联动字段名称
          "type": "visible",     // type 指 联动类型（linkage 为数据联动，visible 为显示隐藏控制）
          "valueList": [1, 2]   // 控制显示隐藏的可能的值 valueList ，这里的含义是 当 valueType=1或2时，字段authority才会显示
        }, 


        {
          "type": "linkage",   // type 指 联动类型（linkage 为数据联动，visible 为显示隐藏控制）
          "fieldName": "registerType",    // fieldName 指 依赖的联动字段名称
          "rules": [  // 联动类型为 linkage时，rules 指 依赖的联动字段的数据联动规则（数组对象），这里的例子含义：registerType 字段的值为 valueList时，rwType 字段下拉选项就渲染成 valeEnum
            {
              "valueList": ["1", "3", "5"],   // fieldName 指定字段可能的值，里边的值都会影响当前配置字段（authority）联动效果
              "valueEnum": [   // 联动后控制字段 authority 渲染的数据
                {
                  "label": "读写",
                  "value": "All"
                },
                {
                  "label": "只读",
                  "value": "Read"
                },
                {
                  "label": "只写",
                  "value": "Write"
                }
              ]
            },
            {
              "valueList": ["2", "4", "6"],
              "valueEnum": [
                {
                  "label": "只读",
                  "value": "Read"
                }
              ]
            }
          ]
        }
      ]
    }
```

# TODO

- 支持单位动态，比如长度（字）在某些条件下变成 长度（字节）

## 优化

### 联动优化

#### 显示隐藏优化

> disabledOn 已实现，visible 能力目前在 dependencies 里有了，看后续是否也支持 visibleOn

```json
{
  "visibleOn": "data.type == 3",
  "disabledOn": "data.type == 3"
}
```

#### 表单验证器
