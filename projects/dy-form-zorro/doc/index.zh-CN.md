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

## 通过脚手架生成表单模型
```shell
ng g @supine/dy-form:model LoginModel
```

- 通过上面的命令即可生成 LoginModel 模型内容如下
```typescript
import {BaseFormModel, InputModel, ValidatorRule} from '@supine/dy-form';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: 'label'})
  @ValidatorRule(['max:999'], {max: '最大999'})
  exp = [null];

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlModel[], ...params: any[]): FormControlModel[] | void {
    return model;
  }


  /**
   * 结合我封装的HTTP模块 可轻松实现批量对接与表单相关的接口
   * HTTP模块 目前还没开源
   * 即便不使用我封装的HTTP模块 按照以下模板 也容易实现
   */
  httpRequest() {
    // return this.updateValueAndValidity()
    //   .pipe(
    //     filter(value => value),
    //     concatMap(() => {
    //       // 获取表单数据 如果不能满足需要 可以在子类实现value的获取
    //       const body = super.value;
    //       // 获取提交表单的一些外部参数 比如更新的参数ID  attachValue 通过 model.withAttachValue(数据)进行设置
    //       const {id} = this.attachValue;
    //
    //       // 一系列与表单相关的接口
    //       const httpRequestMap: HttpRequestMap = {
    //         update: [this.http.updateRole, [body, id]],
    //         add: [this.http.addRole, [body]],
    //       };
    //
    //       const [handle, params] = httpRequestMap[this.actionType];
    //
    //       return handle(...params);
    //     }));
  }
}
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

