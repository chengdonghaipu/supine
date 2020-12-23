---
order: 9
title:
  zh-CN: 模型控件initHook
  en-US: Customize Size
---

## zh-CN

如果模型配置比较多，使用***initHook***会更加优雅

***SelectModel*** 在第一个示例中没有实现，所以在这里就以注释的形式描述了

***SelectModel*** 实现方式跟第一个示例中的***InputModel***实现方式是一样的

```typescript
export class LoginModel extends BaseFormModel {
  sexModel = {
    label: '性别',
    optionContent: [
      {label: '保密', value: 0},
      {label: '男', value: 1},
      {label: '女', value: 2},
    ]
  };

  // 不使用表单模型上下文是这样的
  // @SelectModel<FormModel>({label: '性别', optionContent: [{label: '男', value: 1}, {label: '女', value: 1}]})
  // 使用表单模型上下文是这样的 当控件模型定义比较复杂的时候用这种方法有着很大的优势
  @SelectModel<LoginModel>({initHook: (that, context) => Object.assign(that, context.sexModel)})
  sex: [null];
}
```

## en-US

Custom spacing size.
