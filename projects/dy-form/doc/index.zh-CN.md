---
category: Components
type: 通用
subtitle: 动态表单
title: dy-form
cols: 1
cover: https://gw.alipayobjects.com/zos/antfincdn/wc6%263gJ0Y8/Space.svg
---

@supine/dy-form是基于Angular表单封装的动态表单库。

通过引入一组可维护的表单控件模型和动态表单控件组件，它完全自动化了表单UI创建。

@supine/dy-form 不依赖于任何Angular UI框架, 任何Angular UI框架都可以基于@supine/dy-form封装成特定风格的动态表单

@supine/dy-form 一般也不会直接在项目中使用，因为内部并没有任何控件模型，只是提供了基础表单控件的接口

目前已经适配NG-ZORRO ---  @supine/dy-form-zorro

## 何时使用

不是太简单的表单都适合使用。

## 主要特性
- 解耦
  - 传统的Angular表单开发需要成百上千行HTML，在组件内部维护大量与表单相关的代码，不利于后期维护，可读性不强。
`@supine/dy-form` 最主要的初衷就是将与表单相关的业务集中到表单模型中解决，从而减弱与组件的耦合度

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
- [@supine/dy-form-zorro](https://www.npmjs.com/package/@supine/dy-form-zorro) 是基于@supine/dy-form 为ng-zorro适配的开箱即用的动态表单库
- 轻量级、易拓展验证库(文档中涉及的验证参考该文档)[@supine/validator](https://www.npmjs.com/package/@supine/validator)

```ts
import { DyFormModule } from ' @supine/dy-form';
```

# 基于@supine/dy-form封装动态表单基本步骤
- 安装
  ```shell
  ng add @supine/dy-form
  ```

- 实现表单控件模型

- 实现表单控件模型对应的装饰器

- 生成一个Angular组件&并配置模板

- 在组件中注册FormFooterTemplate、FormHeaderTemplate、FormControlTemplate等

# 使用封装好的动态表单

- 第一步: 定义表单模型
- 第二步: 在HTML中声明动态表单
- 第三步: 在组件中定义dyFormRef属性
- 第四步: dyFormRef.executeModelUpdate();执行渲染

## API

### jd-dy-form

| 参数 | 说明 | 类型 | 默认值 | 是否必传 |
| --- | --- | --- | --- | --- |
| `[dyFormRef]` | 所有表单功能都由dyFormRef间接控制 | `DyFormRef` |  | ✅ |

### dyFormRef

- 成员属性

| 成员属性 | 说明 | 类型 | 默认值 | 访问权限 | 使用频率 |
| --- | --- | --- | --- | --- | --- |
| `model` | 表单模型实例，模型注册后即可获取 | `<T extends BaseFormModel>` | `null` | `public` | 很高 |
| `dyForm` | 动态表单实例,一般很少用 | `DyFormComponent` | `null` | `public` | 很低 |
| `allOptions` | 所有模型控件配置，一般拓展dyFormRef可能会用到 | `FormControlConfig[]` | `[]` | `protected` | 很低 |

- 成员方法 - 根据使用频率从高往低排序

```
/**
 * 触发模型modelUpdateHook 从而更新视图
 * @param params 传递给modelUpdateHook的参数 对于复杂场景很有用
 */
 executeModelUpdate(...params: any[]): void
```

```
/**
 * 重置表单
 * @param value
 * @param options
 */
 reset(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean })
```

```
/**
 * 填充表单数据
 * @param value
 * @param options
 */
 setValues(value: { [p: string]: any }, options?: { onlySelf?: boolean; emitEvent?: boolean }): this
```

```
/**
 * 新增表单控件 一般很少用 建议通过modelUpdateHook实现相应的业务
 * @param control 控件模型，可以是数组
 * @param indexOrName 插入指定的索引位置或者控件名称位置 可选
 */
 addControl<C extends BaseModel>(control: C | C[], indexOrName?: number | string): this
```

```
/**
 * 更新表单控件 一般很少用 建议通过modelUpdateHook实现相应的业务
 * @param control 控件模型，可以是数组
 */
 updateControl<C extends BaseModel>(control: C | C[]): this
```

```
/**
 * 移除表单控件 一般很少用 建议通过modelUpdateHook实现相应的业务
 * @param controlName 控件名称
 */
 removeControl(controlName: string | string[]): this
```

```
/**
 * 注册表单模型
 * @param model 表单模型
 * @return this
 */
 protected registeredModel<M extends BaseFormModel>(model: Type<M>): this
```

### DyFormComponent

```typescript
interface DyFormComponent {
  /**
   * 表单组
   */
  formArea: FormGroup;

  dyFormRef: DyFormRef;

  /**
   * 重置表单
   * @param value
   * @param options
   */
  reset(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void;

  /**
   * 填充表单数据
   * @param value
   * @param options
   */
  setValues(value: { [p: string]: any }, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;

  /**
   * 添加控件模型类型(注册表单控件模板) 比如INPUT 模型 基于@supine/dy-form封装动态表单 这是必须要的
   * @param columnDef
   */
  addColumnDef(columnDef: DyFormColumnDef): void;

  /**
   * 移除控件模型模板
   * @param columnDef
   */
  removeColumnDef(columnDef: DyFormColumnDef): void;

  /**
   * 注册表单header模板 基于@supine/dy-form封装动态表单 这是必须要的
   * @param headerRowDef
   */
  addHeaderRowDef(headerRowDef: DyFormHeaderDef): void;

  /**
   * 移除表单header模板
   * @param headerRowDef
   */
  removeHeaderRowDef(headerRowDef: DyFormHeaderDef): void;

  /**
   * 注册表单footer模板 基于@supine/dy-form封装动态表单 这是必须要的
   * @param footerRowDef
   */
  addFooterRowDef(footerRowDef: DyFormFooterDef): void;

  /**
   * 移除表单footer模板
   * @param footerRowDef
   */
  removeFooterRowDef(footerRowDef: DyFormFooterDef): void;
}
```
