# DyForm

@supine/dy-form是基于Angular表单封装的动态表单库。

通过引入一组可维护的表单控件模型和动态表单控件组件，它完全自动化了表单UI创建

@supine/dy-form 不依赖于任何Angular UI框架, 任何Angular UI框架都可以基于@supine/dy-form封装成特定风格的动态表单

@supine/dy-form 一般也不会直接在项目中使用，因为内部并没有任何控件模型，只是提供了基础表单控件的接口

目前已经适配NG-ZORRO ---  @supine/dy-form-zorro

## 主要特性
- 解耦
```
传统的Angular表单开发需要成百上千行HTML，在组件内部维护大量与表单相关的代码，不利于后期维护，可读性不强。
@supine/dy-form最核心的思想就是将与表单相关的业务集中到表单模型中解决，从而减弱与组件的耦合性
```
- 高可读性
    - 所有控件配置都在表单模型中，表单结构一目了然
- 开发快速
    - 不需要成百上千行HTML，组件内部也不需要维护大量与表单相关的代码
    - 大多数情况 只需要一行HTML代码和一行TS代码即可生成期望的表单
- 面向对象
    - 表单模型、控件模型都基于class实现的，表单模型、控件模型都提供了基类，可以基于基类继承进行拓展
- 易拓展性
    - 轻松实现自定义控件

# 基于@supine/dy-form 定制不同Angular UI框架的动态表单(自定义控件)
- 安装

```
ng add @supine/dy-form
```

- 在模块中导入 DyFormModule

- 实现控件模型(以input为例)
```typescript
import {BaseModel, ModelPartial} from '@supine/dy-form';

export class InputModelControl<M = any> extends BaseModel<M> {
  /**
   * type 必须要实现 不同的type代表不同的控件
   */
  type = 'INPUT';

  /**
   * 只读 如果为true 表示该控件为只读状态
   */
  readonly = false;
  // 如果需要其他属性 添加相应的属性即可
  constructor(init?: ModelPartial<InputModelControl>) {
    super();
    this.init(init);
  }
}
```
- 实现控件模型对应的装饰器(以input为例)

```typescript
import {InputModelControl as Model} from '../model/input-model.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function InputModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'INPUT' }).type = 'INPUT';
    Object.assign(newModel, model);
  }
  return BaseDecorator(newModel);
}
```

- 生成一个Angular组件&并配置模板

```angular2html
<!--模板-->
<!--通用错误提示-->
<ng-template #errorTpl let-control>
  <ng-container *ngIf="control.hasError(control.name)">
    {{control.getError(control.name)}}
  </ng-container>
</ng-template>
<ng-template #label let-model>
  <nz-form-label [nzRequired]="model.required"
                 [style.flex]="dyForm?.dyFormRef.labelColLayout[dyForm.breakpoint]"
                 [ngClass]="dyForm.labelClass(model)"
                 [ngStyle]="model.labelStyle"
                 [nzFor]="model.controlName">{{model.label}}
  </nz-form-label>
</ng-template>
<jd-dy-form [dyFormRef]="dyFormRef" #dyForm>
  <!-- INPUT 就是上面实现的input模型的type属性
       model 对应的就是控件模型
       control 代表的是表单控件实例
   -->
  <nz-form-item *jdDyFormColumnDef="let control; let model = model name 'INPUT'">
    <ng-template [ngTemplateOutlet]="label" [ngTemplateOutletContext]="{$implicit: model}"></ng-template>
     <nz-form-control [nzErrorTip]="errorTpl"
                      [ngStyle]="model.controlStyle"
                      [nzValidateStatus]="control"
                      [ngClass]="dyForm.controlClass(model)">
    </nz-form-control>
  </nz-form-item>
</jd-dy-form>
```

```typescript
// TS
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DyFormColumnDef, DyFormComponent, DyFormFooterDef, DyFormHeaderDef, DyFormRef} from '@supine/dy-form';

@Component({
  selector: 'jd-dy-form-zorro',
  templateUrl: './dy-form-zorro.component.html',
  styleUrls: ['./dy-form-zorro.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DyFormZorroComponent implements OnInit, AfterContentInit {
  @ViewChild(DyFormComponent, {static: true}) dyForm: DyFormComponent;

  @ContentChildren(DyFormHeaderDef, {descendants: true}) _formHeaderDefs: QueryList<DyFormHeaderDef>;

  @ContentChildren(DyFormFooterDef, {descendants: true}) _formFooterDefs: QueryList<DyFormFooterDef>;

  @ContentChildren(DyFormColumnDef, {descendants: true}) _formColumnDefs: QueryList<DyFormColumnDef>;

  @Input() dyFormRef: DyFormRef<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    // 注册form Footer 可以有多行
    this._formFooterDefs.forEach(item => this.dyForm.addFooterRowDef(item));
    // 注册form Header 可以有多行
    this._formHeaderDefs.forEach(item => this.dyForm.addHeaderRowDef(item));
    // 注册表单控件模板
    this._formColumnDefs.forEach(item => this.dyForm.addColumnDef(item));
  }

}
```
- 按照以上的步骤即可封装一个完整的动态表单来


# 使用封装好的的动态表单

- 定义表单模型
```typescript
import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
import {InputModel} from '../decorator/input.model';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  username = [null];

  @InputModel<LoginModel>({label: '密码'})
  @ValidatorRule(['required&max:15&min:4'], {required: '密码字段是必填的', max: '密码长度最多为15个字符', min: '密码长度最少为4个字符'})
  password = [null];

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: any[]): FormControlConfig[] | void {
    return model;
  }


  /**
   * 结合我封装的HTTP模块 可轻松实现批量对接与表单相关的接口
   * HTTP模块 目前还没开源
   * 即便不使用我封装的HTTP模块 按照以下模板 也容易实现
   */
  httpRequest() {
    // 获取表单数据 如果不能满足需要 可以在子类重写value的获取
    // const body = this.value;
    // 获取提交表单的一些外部参数 比如更新的参数ID  attachValue 通过 model.withAttachValue(数据)进行设置
    // const {mapId, id} = this.attachValue;
    //
    // body.id = id;
    // 组装接口所需要的参数
    // const tempBody = {
    //   mapId,
    //   area_info: body
    // };

    // 一系列与表单相关的接口
    // const httpRequestMap: HttpRequestMap = {
    // update: [this.http.editAreaBaseInfo, [tempBody]]
    /* UnloadMineralArea: [this.http.setUnLoadMineralArea, [body, mapId]],
       UnloadWasteArea: [this.http.setUnLoadWasteArea, [body, mapId]],
       LoadArea: [this.http.setLoadArea, [body, mapId]],
       Road: [this.http.setRoad, [body, mapId]],
       PassableArea: [this.http.setPassableArea, [body, mapId]],
       ImpassableArea: [this.http.setImPassableArea, [body, mapId]],
       Junction: [this.http.setJunction, [body, mapId]],
       create: [this.http.createMapUtil, [body, mapId]] */
    // };

    // const [handle, params] = httpRequestMap[this.actionType];
    //
    // return handle(...params);
  }
}

```

- 然后在HTML中声明动态表单
```angular2html
<jd-dy-form-zorro [dyFormRef]="dyFormRef"></jd-dy-form-zorro>
```

- 在组件中定义dyFormRef属性

```typescript
import {Component, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';
import {FormModel} from './form.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dyFormRef = new DyFormRef(FormModel, {mode: 'vertical'});

  ngOnInit(): void {
  }

  constructor() {
    // 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();
  }

}
```

- 至此就可以看到我们想要的表单啦
  
![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/login-dy-form.png)
- 组件内部我们只需要维护极少数代码就能完成表单的相关操作啦
  
# 自定义布局

- 修改模型
```typescript
import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
import {InputModel} from '../decorator/input.model';

export class LoginModel extends BaseFormModel {
  // 布局容器 我们可以指定自定义类型 type=phone  默认值为LAYOUT_GROUP
  @LayoutGroupModel({type: 'phone'})
  layout;
   
  // parent: 'layout' 指定容器 layout
  @InputModel<FormModel>({label: '手机号码', parent: 'layout'})
  @ValidatorRule(['required&phoneNum'], {required: '用户名字段是必填的', phoneNum: '请填写正确的手机号码'})
  phone = [null];

  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  username = [null];

  @InputModel<LoginModel>({label: '密码'})
  @ValidatorRule(['required&max:15&min:4'], {required: '密码字段是必填的', max: '密码长度最多为15个字符', min: '密码长度最少为4个字符'})
  password = [null];

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: any[]): FormControlConfig[] | void {
    return model;
  }


  /**
   * 结合我封装的HTTP模块 可轻松实现批量对接与表单相关的接口
   * HTTP模块 目前还没开源
   * 即便不使用我封装的HTTP模块 按照以下模板 也容易实现
   */
  httpRequest() {
    /* .... */
  }
}

```
- 接下来修改模板

```angular2html
<!--通用错误提示-->
<ng-template #errorTpl let-control>
  <ng-container *ngIf="control.hasError(control.name)">
    {{control.getError(control.name)}}
  </ng-container>
</ng-template>
<ng-template #label let-model>
  <nz-form-label [nzRequired]="model.required"
                 jdDyFormLabelDef
                 [ngStyle]="model.labelStyle"
                 [nzFor]="model.controlName">{{model.label}}
  </nz-form-label>
</ng-template>

<jd-dy-form-zorro [dyFormRef]="dyFormRef">
<!--  phone 跟模型中的layout字段的元数据type是相对应的-->
<!--  groupModel 包含布局容器内所有字控件的配置信息 比如我要访问容器内phone控件的配置可以这样访问 groupModel.phone-->
<!--  childControl 包含布局容器内所有字控件的formControl 比如我要访问容器内phone控件可以这样访问 childControl.phone-->
  <ng-container *jdDyFormColumnDef="let model = model name 'phone', let groupModel = groupInfo, let childControl = childControl">
    <nz-form-item>
      <ng-template [ngTemplateOutlet]="label" [ngTemplateOutletContext]="{$implicit: groupModel.phone}"></ng-template>
      <nz-form-control
        jdDyFormControlDef
        [nzValidateStatus]="childControl.phone"
        [nzErrorTip]="errorTpl"
      >
        <nz-input-group [nzAddOnBefore]="addOnBeforeTemplate">
          <ng-template #addOnBeforeTemplate>
            <nz-select class="phone-select" [ngModel]="'+86'">
              <nz-option nzLabel="+86" nzValue="+86"></nz-option>
              <nz-option nzLabel="+87" nzValue="+87"></nz-option>
            </nz-select>
          </ng-template>
          <input [formControl]="childControl.phone" id="'phoneNumber'" nz-input/>
        </nz-input-group>
      </nz-form-control>
    </nz-form-item>
  </ng-container>
</jd-dy-form-zorro>
```
- 预览图如下
  
![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/layout_preview.png)
- 看上去挺多的 但只需要把常见的使用场景封装好了 以后开发就不要写什么模板了

# 自定义控件

- (1)通过内置装饰器实现(更简单, 推荐临时使用的时候用该方式)
    - 修改模型
    ```typescript
    import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
    import {InputModel} from '../decorator/input.model';
    
    export class LoginModel extends BaseFormModel {
      // customPro 为自定义模型属性 将作为模板上下文属性 在模板中可以访问到
      // 可以定义多个自定义属性
      // type 默认为CUSTOM 允许修改
      @CustomModel({label: '自定义', type: 'custom', customPro: 'customPro'})
      custom = [null];
  
      @InputModel<FormModel>({label: '手机号码'})
      @ValidatorRule(['required&phoneNum'], {required: '用户名字段是必填的', phoneNum: '请填写正确的手机号码'})
      phone = [null];
    
      @InputModel<LoginModel>({label: '用户名'})
      @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
      username = [null];
    
      @InputModel<LoginModel>({label: '密码'})
      @ValidatorRule(['required&max:15&min:4'], {required: '密码字段是必填的', max: '密码长度最多为15个字符', min: '密码长度最少为4个字符'})
      password = [null];
    
      /**
       * 更新表单模型钩子
       * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
       * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
       * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
       * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
       */
      modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: any[]): FormControlConfig[] | void {
        return model;
      }
    
    
      /**
       * 结合我封装的HTTP模块 可轻松实现批量对接与表单相关的接口
       * HTTP模块 目前还没开源
       * 即便不使用我封装的HTTP模块 按照以下模板 也容易实现
       */
      httpRequest() {
        /* .... */
      }
    }
  ```
  - 接下来修改模板
  ```angular2html
  <!--通用错误提示-->
  <ng-template #errorTpl let-control>
    <ng-container *ngIf="control.hasError(control.name)">
      {{control.getError(control.name)}}
    </ng-container>
  </ng-template>
  <ng-template #label let-model>
    <nz-form-label [nzRequired]="model.required"
                   jdDyFormLabelDef
                   [ngStyle]="model.labelStyle"
                   [nzFor]="model.controlName">{{model.label}}
    </nz-form-label>
  </ng-template>
  
  <jd-dy-form-zorro [dyFormRef]="dyFormRef">
    <!--  name 'custom' 对应模型中的 type字段值-->
    <ng-container *jdDyFormColumnDef="let control; let model = model name 'custom'">
      <nz-form-item>
        <ng-template [ngTemplateOutlet]="label" [ngTemplateOutletContext]="{$implicit: model}"></ng-template>
        <nz-form-control  jdDyFormControlDef
                          [nzValidateStatus]="control"
                          [nzErrorTip]="errorTpl">
          <!--        customPro 为模型中自定义属性-->
          <input type="text" nz-input [formControl]="control" [placeholder]="model.customPro">
        </nz-form-control>
      </nz-form-item>
    </ng-container>
  </jd-dy-form-zorro>
  ```
  - 预览图
  ![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/default-custom-preview.png)
- (2)通过集成基类模型实现(复用的解决方案, 推荐在封装通用的控件时使用)
  - 基于@supine/dy-form 定制不同Angular UI框架的动态表单 章节其实就是自定义控件

# 在定义控件模型的时候使用表单模型的上下文
- 模型
```typescript
import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
import {InputModel} from '../decorator/input.model';

export class LoginModel extends BaseFormModel {
  sexModel = {
    label: '性别',
    optionContent: [
      {label: '男', value: 1},
      {label: '女', value: 1}
    ]
  };

  // 不使用表单模型上下文是这样的
  // @SelectModel<FormModel>({label: '性别', optionContent: [{label: '男', value: 1}, {label: '女', value: 1}]})
  // 使用表单模型上下文是这样的 当控件模型定义比较复杂的时候用这种方法有着很大的优势
  @SelectModel<FormModel>({initHook: (that, context) => Object.assign(that, context.sexModel)})
  sex: [null];

  @InputModel<FormModel>({label: '用户名'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  username = [null];

  @InputModel<FormModel>({label: '手机号码'})
  @ValidatorRule(['required&phoneNum'], {required: '用户名字段是必填的', phoneNum: '请填写正确的手机号码'})
  phone = [null];

  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  username = [null];

  @InputModel<LoginModel>({label: '密码'})
  @ValidatorRule(['required&max:15&min:4'], {required: '密码字段是必填的', max: '密码长度最多为15个字符', min: '密码长度最少为4个字符'})
  password = [null];

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: any[]): FormControlConfig[] | void {
    return model;
  }


  /**
   * 结合我封装的HTTP模块 可轻松实现批量对接与表单相关的接口
   * HTTP模块 目前还没开源
   * 即便不使用我封装的HTTP模块 按照以下模板 也容易实现
   */
  httpRequest() {
    /* .... */
  }
}

```
- 模板
```angular2html
<jd-dy-form-zorro [dyFormRef]="dyFormRef"></jd-dy-form-zorro>
```

- 预览图
  ![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/form-context-preview.png)

# 验证器

- 简单使用
```js
import {JdValidator} from '@supine/dy-form';

const v = new JdValidator();
    // 验证规则
    const rules = {
      a: ['required', 'in:12,13'] // 或者 'required&in:12,13'
    };
    // 被验证的数据
    const data = {a: 'kl'};
    v.make(rules, data);
    if (v.fails()) {
      // 获取错误信息
      console.log(v.getMessages()); // a 必须在 12,13 范围内
    }
```
- 批量验证

```js
import {JdValidator} from '@supine/dy-form';

const v = new JdValidator();
    // 验证规则
    const rules = {
      a: ['required', 'in:12'] // 或者 'required&in:12'
    };
    // 被验证的数据
    const data = {a: '121'};
    // 批量验证  默认为false
    v.batch(true).make(rules, data);
    if (v.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```
- 自定义验证信息

```js
import {JdValidator} from '@supine/dy-form';

const v = new JdValidator();
    // 验证规则
    const rules = {
      a: ['required', 'in:12, 13'] // 或者 'required&in:12,13'
    };
    // 被验证的数据
    const data = {a: '121'};
    // 批量验证  默认为false
    v.batch(true).make(rules, data,
     // 自定义验证规则信息提示
     {
      'a.required': '字段a是必填的',
      'a.in': '字段a只能是12,13中的一个值'
    });
    if (v.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```
- 嵌套验证

```js
import {JdValidator} from '@supine/dy-form';

const v = new JdValidator();
    // 验证规则
    const rules = {
      'a.b': ['required', 'in:12, 13'] // 或者 'required&in:12,13'
    };
    // 被验证的数据
    const data = {a: {
      b: '123'
    }};
    // 批量验证  默认为false
    v.batch(true).make(rules, data,
     // 自定义验证规则
     {
      'a.b.required': '字段a.b是必填的',
      'a.b.in': '字段a.b只能是12,13中的一个值'
    });
    if (v.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```
- Validator 根验证器
  
  Validator没有任何内置的验证规则  可以基于Validator来拓展自定义规则
  
  JdValidator就是基于Validator拓展而来的
  
  - API
    ```
    // 批量验证
    batch(isBatch: boolean = false): this
    // 验证
    make(rules?: { [key: string]: any },
                data?: { [key: string]: any },
                messages?: { [key: string]: any }): boolean
                
    // 设置规则(会重置规则)
    setRules(rules): this
    // 增加规则(不会重置规则)
    addRules(rules): this
    // 判断规则是否已经存在
    hasRule(ruleName: string): boolean
    // 清空所有错误信息
    clearMsg(): this
    // 获取错误信息
    getMessages(): { [key: string]: string[] }
    // 判断是否验证通过 false为验证通过 true为失败
    fails(): boolean
    // 新增错误信息
    addMsg(key: string, _msg: string)
    // 添加验证后回调。
    registerAfterF(callback: (that: this) => void)
    ```
- 添加验证后回调钩子
  ```js
     const v = new JdValidator();
     
         v.registerAfterF(that => {
           // 一些操作...  比如在一条件下添加错误信息  或者清除错误信息
         });
  ```
- 自定义验证规则

 ```js
     import {AfterF, JdValidator, Registered, RuleF, TypeMsg, Validator, ValidatorF} from '@supine/dy-form';
     import {ValidatorFs} from './validator-fs';
     
     @Registered({
       // 如果希望使用内置校验规则 可以将内置规则也放到这 ValidatorF
       declarations: [ValidatorFs, ValidatorF] // 自定义验证规则(批量)
     })
     // 如果希望使用内置规则 可以 继承 JdValidator 或者在 @Registered 的 declarations 里添加 ValidatorF
     // 如果不希望使用内置规则 那么 继承 Validator(根验证器)
     export class Validators extends Validator {
       // 也可以在这里添加验证规则 验证后的回调钩子 默认的错误信息提示
       // 验证规则和默认的错误信息使用跟在ValidatorFs中的使用是一模一样的
       // 验证规则默认提示信息
       // 不推荐使用
       @TypeMsg()
       typeMsg = {
         accepted: ':attribute 必须是yes、on或者1或者true',  // :attribute  是占位符  将会用被验证的属性名替代
       };
     
       @RuleF()
       hello(value: any, rule: string[], dataMap: Map<string, any>): string {
         if (!rule[0]) { // 获取参数
           // 如果不存在参数  那么说明规则使用错误  可以报错提示!
         }
         // 获取参数字段的值
         const otherFieldValue = dataMap.get(rule[0]);
         return otherFieldValue === 'hello' ? '' : '错误原因...';
       }
     }
  ```
   - ValidatorFs.ts 代码
   ```js
     //  ValidatorFs.ts 代码
     import {RuleF, TypeMsg} from '@supine/dy-form';
     
     export class ValidatorFs {
       // 验证规则默认提示信息
       // 不推荐使用
       @TypeMsg()
       typeMsg = {
         accepted: ':attribute 必须是yes、on或者1或者true',  // :attribute  是占位符  将会用被验证的属性名替代
       };
     
       /**
        * @param value 被验证的数据 不用担心是怎么传过来的 因为这个是验证器做的事
        * @param {string[]} rule 验证的规则 不用担心是怎么传过来的 因为这个是验证器做的事
        * @param {Map<string, any>} dataMap 解析后数据 可以根据属性名获取对应的数据
        * @returns {string} 返回值可以为string 或者 boolean 当为 string 时
        * 自动将返回值作为自定义错误信息提示 如果验证失败请返回失败原因(字符串) 如果验证通过 请返回空字符''
        * 当为 boolean 时 为true说明验证失败 为false说明验证通过
        * 方法名hello 为验证规则的名称  后面可以跟参数 比如 hello:otherField
        * 装饰器 @RuleF() 告诉验证 该方法为验证规则  如果没有声明该装饰器的方法  将不会拓展该规则
        * 例子: 实现hello规则 当otherField的值为hello 该规则才通过 否则失败
        */
       @RuleF()
       hello(value: any, rule: string[], dataMap: Map<string, any>): string {
         if (!rule[0]) { // 获取参数
           // 如果不存在参数  那么说明规则使用错误  可以报错提示!
         }
         // 获取参数字段的值
         const otherFieldValue = dataMap.get(rule[0]);
         return otherFieldValue === 'hello' ? '' : '错误原因...';
       }
     }
   ```
- JdValidator 内置的验证规则

    - required ()
      ```
      参数: 无
      使用: required
      ```
    - requiredWith (只要在指定的其他字段中有任意一个字段存在时，被验证的字段就必须存在并且不能为空)
      ```
      参数: filed1,filed2...
      使用: requiredWith: filed1,filed2...
      ```
    - requiredWithAll (只有当所有的其他指定字段全部存在时，被验证的字段才必须存在并且不能为空)
      ```
      参数: filed1,filed2...
      使用: requiredWithAll: filed1,filed2...
      ```
    - requiredWithout (只要在其他指定的字段中有任意一个字段不存在，被验证的字段就必须存在且不为空)
      ```
      参数: filed1,filed2...
      使用: requiredWithout: filed1,filed2...
      ```
    - requiredWithoutAll (只有当所有的其他指定的字段都不存在时，被验证的字段才必须存在且不为空)
      ```
      参数: filed1,filed2...
      使用: requiredWithoutAll: filed1,filed2...
      ```
    - requiredIf (如果指定的其它字段（ filed1 ）等于任何一个 value 时，被验证的字段必须存在且不为空)
      ```
      参数: filed1,value1...
      使用: requiredIf: filed1,value1...
      ```
    - requiredUnless (如果指定的其它字段（ filed ）等于任何一个 value 时，被验证的字段不必存在)
      ```
      参数: filed1,value1...
      使用: requiredUnless: filed1,value1...
      ```
    - filled (验证的字段在存在时不能为空)
      ```
      参数: 无
      使用: filled
      ```
    - accepted (验证的字段必须为 yes、 on、 1、或 true。这在确认「服务条款」是否同意时相当有用)
      ```
      参数: 无
      使用: accepted
      ```
    - present (验证的字段必须存在于输入数据中，但可以为空)
      ```
      参数: 无
      使用: present
      ```
    - confirmed (验证的字段必须和 filed 的字段值一致。例如，如果要验证的字段是 password，输入中必须存在匹配的 filed 字段)
      ```
      参数: filed
      使用: confirmed: filed
      ```
    - same (给定字段必须与验证的字段匹配)
      ```
      参数: filed
      使用: same: filed
      ```
    - different (验证的字段值必须与字段 (field) 的值不同)
      ```
      参数: filed
      使用: different: filed
      ```
    - before (验证的字段必须是给定日期之前的值)
      ```
      参数: filed
      使用: before: filed
      ```
    - after (验证的字段必须是给定日期之后的值)
      ```
      参数: filed
      使用: after: filed
      ```
    - beforeOrEqual (验证的字段必须是给定日期之前或等于之前的值)
      ```
      参数: filed
      使用: beforeOrEqual: filed
      ```
    - afterOrEqual (验证的字段必须是给定日期之后或等于之后的值)
      ```
      参数: filed
      使用: afterOrEqual: filed
      ```
    - dateEqual (验证的字段必须等于给定的日期)
      ```
      参数: filed
      使用: dateEqual: filed
      ```
    - dateFormat (验证的字段必须与给定的格式相匹配)
      ```
      参数: filed
      使用: dateFormat: filed
      ```
    - gt (验证的字段的值大于other字段值)
      ```
      参数: filed
      使用: gt: filed
      ```
    - lt (验证的字段的值小于other字段值)
      ```
      参数: filed
      使用: lt: filed
      ```
    - gte (验证的字段的值大于等于other字段值)
      ```
      参数: value
      使用: gte: value
      ```
    - lte (验证的字段的值小于等于other字段值)
      ```
      参数: value
      使用: lte: value
      ```
    - min (验证中的字段必须具有最小值。字符串、数字、数组的计算方式都用 size 方法进行评估)
      ```
      参数: value
      使用: min: value
      ```
    - max (验证中的字段必须小于或等于 value。字符串、数字、数组的计算方式都用 size 方法进行评估)
      ```
      参数: value
      使用: max: value
      ```
    - minLength (验证中的字段必须具有最小长度。字符串、数字(会转换为字符串计算)、数组的计算方式都用 size 方法进行评估)
      ```
      参数: value
      使用: maxLength: value
      ```
    - maxLength (验证中的字段必须满足最大长度 字符串、数字(会转换为字符串计算)、数组的计算方式都用 size 方法进行评估)
      ```
      参数: value
      使用: maxLength: value
      ```
    - between (验证的字段的大小必须在给定的 min 和 max 之间。字符串、数字、数组的计算方式都用 size 方法进行评估)
      ```
      参数: min,max
      使用: between: min,max
      ```
    - size (验证的字段必须具有与给定值匹配的大小。对于字符串来说，value 对应于字符数。对于数字来说，value 对应于给定的整数值 对于数组来说， size 对应的是数组的 count 值)
      ```
      参数: value
      使用: size: value
      ```
    - numeric (数字)
      ```
      参数: 无
      使用: numeric
      ```
    - integer (整型)
      ```
      参数: 无
      使用: integer
      ```
    - array (数组)
      ```
      参数: 无
      使用: array
      ```
    - in (验证的字段必须包含在给定的值列表中)
      ```
      参数: value1,value2...
      使用: in: value1,value2...
      ```
    - notIn (验证的字段不能包含在给定的值列表中)
      ```
      参数: value1,value2...
      使用: notIn: value1,value2...
      ```
    - alpha (验证的字段必须完全是字母的字符)
      ```
      参数: 无
      使用: alpha
      ```
    - alphaDash (验证的字段可能具有字母、数字、破折号(-) 以及下划线(_)
      ```
      参数: 无
      使用: alphaDash
      ```
    - alphaNum (只包含字母、数字)
      ```
      参数: 无
      使用: alphaNum
      ```
    - chsDash (只允许汉字、字母、数字和下划线_及破折号-)
      ```
      参数: 无
      使用: chsDash
      ```
    - chs (只允许汉字)
      ```
      参数: 无
      使用: chs
      ```
    - chsAlpha (只允许汉字、字母)
      ```
      参数: 无
      使用: chsAlpha
      ```
    - chsAlphaNum (验证的字段必须完全是汉字、字母和数字)
      ```
      参数: 无
      使用: chsAlphaNum
      ```
    - email (验证的字段必须是邮箱)
      ```
      参数: 无
      使用: email
      ```
    - float (验证的字段必须完全是浮点数)
      ```
      参数: 无
      使用: float
      ```
    - phoneNum (验证的字段必须是手机号码)
      ```
      参数: 无
      使用: phoneNum
      ```
    - telNumber (验证的字段必须是电话号码)
      ```
      参数: 无
      使用: telNumber
      ```
    - regex (验证的字段必须与给定的正则表达式匹配 注意： 当使用 regex 规则时，你必须使用数组，而不是使用 | 分隔符，特别是如果正则表达式包含 | 字符)
      ```
      参数: reg
      使用: requiredWith: reg
      ```

# 在dy-form中使用自定义验证器
```haml
@NgModule({
  declarations: [
    /* ... */
  ],
  imports: [
    /* ... */
  ],
  providers: [
    // XValidator这就是基于Validator拓展的验证器
    // 自定义验证规则 在定义验证规则有详细描述
    {provide: DY_FORM_VALIDATOR, useValue: new XValidator()}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```
