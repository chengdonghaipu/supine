---
category: Components
type: 通用
subtitle: 动态表单(zorro版)
title: dy-form-zorro
cols: 1
cover: https://gw.alipayobjects.com/zos/antfincdn/wc6%263gJ0Y8/Space.svg
---

@supine/dy-form-zorro是基于@supine/dy-form 为ng-zorro适配的开箱即用的动态表单库。

拥有@supine/dy-form所有特性, 因此在这里写的代码示例不多, 更多示例请参考dy-form模块。

## 何时使用

不是太简单的表单都适合使用。

## 主要特性
- 解耦
  - 传统的Angular表单开发需要成百上千行HTML，在组件内部维护大量与表单相关的代码，不利于后期维护，可读性不强。
[@supine/dy-form](https://www.npmjs.com/package/@supine/dy-form)
最主要的初衷就是将与表单相关的业务集中到表单模型中解决，从而减弱与组件的耦合度

- 高可读性
  - 所有控件配置都在表单模型中，表单结构一目了然
- 快速开发
  - 不需要成百上千行HTML，组件内部也不需要维护大量与表单相关的代码
  - 大多数情况 只需要一行HTML代码和几行TS代码即可生成期望的表单
  - 表单校验，一般来说只需一行代码搞定
  - 批量对接接口
- 面向对象
  - 表单模型、控件模型都基于class实现的，表单模型、控件模型都提供了基类，可以基于基类继承进行拓展
- 易拓展性
  - 轻松实现自定义控件
  - 轻松实现自定义布局
  - 轻松拓展内置校验规则

# 相关库
- 基于@supine/dy-form[@supine/dy-form](https://www.npmjs.com/package/@supine/dy-form)
- 轻量级、易拓展验证库(文档中涉及的验证参考该文档)[@supine/validator](https://www.npmjs.com/package/@supine/validator)

```ts
import { DyFormZorroModule } from ' @supine/dy-form-zorro';
```


## API

### 内置的所有控件模型

|  名称   | 描述 | 配置 |
|  ----  | ---- | ------- |
| **InputModel**  | 模型配置项请参考ng-zorro-antd中 `InputModule` 部分 |  输入框 |
| **InputGroupModel**  | 模型配置项请参考ng-zorro-antd中 `InputModule` 部分 |  数字输入框组 |
| **InputNumberModel**  | 模型配置项请参考ng-zorro-antd中 `InputNumberModule` 部分 |  数字输入框 |
| **InputNumberGroupModel**  | 模型配置项请参考ng-zorro-antd中 `InputModule` 部分 |  数字输入框组 |
| **TextareaModel**  | 模型配置项请参考ng-zorro-antd中 `InputModule` 部分 |  文本域 |
| **SelectModel**  | 模型配置项请参考ng-zorro-antd中 `SelectModule` 部分 |  下拉框 |
| **SelectGroupModel**  | 模型配置项请参考ng-zorro-antd中 `InputModule` 部分 |  下拉框组 |
| **DatePickerModel**  | 模型配置项请参考ng-zorro-antd中 `DatePickerModule` 部分 |  日期选择框 |
| **RangePickerModel**  | 模型配置项请参考ng-zorro-antd中 `RangePickerModule` 部分 |  日期范围选择 |
| **TimePickerModel**  | 模型配置项请参考ng-zorro-antd中 `TimePickerModule` 部分 |  时间选择 |

### jd-dy-form-zorro

| 参数 | 说明 | 类型 | 默认值 | 是否必传 |
| --- | --- | --- | --- | --- |
| `[dyFormRef]` | 所有表单功能都由dyFormRef间接控制 | `ZorroDyFormRef` |  | ✅ |

### ZorroDyFormRef

ZorroDyFormRef 继承自 DyFormRef

- 成员方法

```
/**
 * 动态设置布局
 * @param layout 'vertical' | 'horizontal' | 'inline' | 'custom'
 */
 setLayout(layout: DyFormMode): void
```

### DyFormZorroComponent

- 暴露了很多模板以便复用，自定义时比较有用，避免很多重复性的代码

```typescript
class DyFormZorroComponent {
  /**
   * 通用错误提示模板
   * @example
   * <jd-dy-form-zorro [dyFormRef]="dyFormRef" #dyFormZorro>
   *   <nz-form-item *jdDyFormColumnDef="let control; let model = model name 'custom'">
   *      <nz-form-control jdDyFormControlDef [nzErrorTip]="dyFormZorro.errorTpl"></nz-form-control>
   *   </nz-form-item>
   * </jd-dy-form-zorro>
   */
  @ViewChild('errorTpl', {static: true}) errorTpl: TemplateRef<{ $implicit: AbstractControl | NgModel }>;

  /**
   * 通用表单控件label模板
   * @example
   * <jd-dy-form-zorro [dyFormRef]="dyFormRef" #dyFormZorro>
   *   <nz-form-item *jdDyFormColumnDef="let control; let model = model name 'custom'">
   *      <ng-template [ngTemplateOutlet]="dyFormZorro.labelTpl" [ngTemplateOutletContext]="{$implicit: model}"></ng-template>
   *      <nz-form-control jdDyFormControlDef [nzErrorTip]="dyFormZorro.errorTpl"></nz-form-control>
   *   </nz-form-item>
   * </jd-dy-form-zorro>
   */
  @ViewChild('label', {static: true}) labelTpl: TemplateRef<void>;

  @ViewChild('inputControl', {static: true}) inputTpl: TemplateRef<void>;

  @ViewChild('inputNumberControl', {static: true}) inputNumberTpl: TemplateRef<void>;

  @ViewChild('textAreaControl', {static: true}) textAreaTpl: TemplateRef<void>;

  @ViewChild('datePickerControl', {static: true}) datePickerTpl: TemplateRef<void>;

  @ViewChild('rangePickerControl', {static: true}) rangePickerTpl: TemplateRef<void>;

  @ViewChild('timePickerControl', {static: true}) timePickerTpl: TemplateRef<void>;

  @ViewChild('selectControl', {static: true}) selectTpl: TemplateRef<void>;

  @ViewChild('formGroupControl', {static: true}) formGroupTpl: TemplateRef<void>;
}
```

