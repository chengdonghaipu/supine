# 文档内容
- [介绍](#DyForm)
- [相关库](#相关库)
- [定制动态表单](#定制动态表单)
- [使用定制好的的动态表单](#使用定制好的的动态表单)
- [自定义控件布局](#自定义控件布局)
- [自定义布局](#自定义布局)
- [自定义控件](#自定义控件)
- [在定义控件模型的时候使用表单模型的上下文](#在定义控件模型的时候使用表单模型的上下文)
- [自定义验证](#自定义验证)
- [填充表单](#填充表单)
- [动态控制表单模型](#动态控制表单模型)

# DyForm

@supine/dy-form是基于Angular表单封装的动态表单库。

通过引入一组可维护的表单控件模型和动态表单控件组件，它完全自动化了表单UI创建。

@supine/dy-form 不依赖于任何Angular UI框架, 任何Angular UI框架都可以基于@supine/dy-form封装成特定风格的动态表单

@supine/dy-form 一般也不会直接在项目中使用，因为内部并没有任何控件模型，只是提供了基础表单控件的接口

目前已经适配NG-ZORRO ---  @supine/dy-form-zorro

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
- 面向对象
  - 表单模型、控件模型都基于class实现的，表单模型、控件模型都提供了基类，可以基于基类继承进行拓展
- 易拓展性
  - 轻松实现自定义控件
  - 轻松实现自定义布局
  - 轻松拓展内置校验规则

# 相关库
- 基于@supine/dy-form适配NG-ZORRO的动态表单库[@supine/dy-form-zorro](https://www.npmjs.com/package/@supine/dy-form-zorro)
- 轻量级、易拓展验证库(文档中涉及的验证参考该文档)[@supine/validator](https://www.npmjs.com/package/@supine/validator)

# 定制动态表单
基于@supine/dy-form 定制不同Angular UI框架的动态表单(自定义控件)
- 安装

```
ng add @supine/dy-form
```

- 在模块中导入 DyFormModule

- 实现控件模型(以input为例)
```typescript
import {BaseModel, ModelPartial, Const} from '@supine/dy-form';

export class InputModelControl<M = any> extends BaseModel<M> {
  /**
   * type 必须要实现 不同的type代表不同的控件
   */
  @Const('INPUT') // 表示type只能为INPUT 不允许被修改
  type!: string;

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
  <ng-container *ngIf="hasError(control)">
    {{getError(control)}}
  </ng-container>
</ng-template>
<ng-template #label let-model>
  <nz-form-label [nzRequired]="model.required"
                 jdDyFormLabelDef
                 [style.flex]="dyForm?.dyFormRef.labelColLayout[dyForm.breakpoint]"
                 [ngClass]="dyForm.labelClass(model)"
                 [ngStyle]="model.labelStyle"
                 [nzFor]="model.controlName">{{model.label}}
  </nz-form-label>
</ng-template>
<ng-template #inputControl let-model let-control=control>
  <input nz-input
         [id]="model.name"
         [placeholder]="model.placeHolder"
         [formControl]="control"
         [disabled]="model.disabled"
         [nzSize]="model.size"
         [type]="model.inputType"
         [readOnly]="model.readonly"/>
</ng-template>
<jd-dy-form [dyFormRef]="dyFormRef" #dyForm>
  <!-- INPUT 就是上面实现的input模型的type属性
       model 对应的就是控件模型
       control 代表的是表单控件实例
   -->
  <nz-form-item *jdDyFormColumnDef="let control; let model = model name 'INPUT'">
    <ng-template [ngTemplateOutlet]="label" [ngTemplateOutletContext]="{$implicit: model}"></ng-template>
     <nz-form-control jdDyFormControlDef
                      [nzHasFeedback]="model.hasFeedback"
                      [nzExtra]="model.extra"
                      [nzValidatingTip]="model.validatingTip"
                      [ngStyle]="model.controlStyle"
                      [nzValidateStatus]="control"
                      [ngClass]="dyForm.controlClass(model)">
        <ng-template [ngTemplateOutlet]="inputControl"
                     [ngTemplateOutletContext]="{$implicit: model, control: control}">
        </ng-template>
    </nz-form-control>
  </nz-form-item>
  <!-- 布局 可以实现各种各样的布局 在我封装的@supine/dy-form-zorro 中有3中内置布局(inline, horizontal, vertical)和一种自定义布局 -->
  <jd-form-layout>
     <form nz-form nzLayout="inline" [formGroup]="dyForm.formArea">
       <ng-container *ngFor="let control of dyForm.options">
         <ng-container jdDyFormLayoutItemName="{{control.name}}"></ng-container>
       </ng-container>
     </form>
  </jd-form-layout>
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

  hasError(control: FormControl) {
    return control.errors && Object.keys(control.errors).length;
  }

  getError(control: FormControl) {
    const errors = Object.getOwnPropertyNames(control.errors);
    return control.getError(errors[0]);
  }

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
-  上面的例子我们只实现了input, 按照以上的步骤即可封装一个完整的动态表单来


# 使用定制好的的动态表单

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
    return this.updateValueAndValidity()
      .pipe(
        // 如果验证未通过 则过滤掉
        filter(value => value),
        map(() => {
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
           })
         );
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
  dyFormRef = new DyFormRef(FormModel);

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
  
# 自定义控件布局

- 修改模型
```typescript
import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
import {InputModel} from '../decorator/input.model';

export class LoginModel extends BaseFormModel {
  // 布局容器 我们可以指定自定义类型 type=phone  默认值为LAYOUT_GROUP
  @LayoutGroupModel({type: 'phone'})
  layout;
   
  // parent: 'layout' 指定容器 layout
  @InputModel<LoginModel>({label: '手机号码', parent: 'layout'})
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
<!--此处省略布局代码-->
</jd-dy-form-zorro>
```
- 预览图如下
  
![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/layout_preview.png)
- 看上去挺多的 但只需要把常见的使用场景封装好了 以后开发就不要写什么模板了

# 自定义布局  
**超简单的自定义布局方式-再也不用担心动态表单布局难的问题了**  
```angular2html
<jd-dy-form [dyFormRef]="dyFormRef" #dyForm>
    <nz-form-item *jdDyFormColumnDef="let control; let model = model name 'INPUT'">
        <!--   省略控件定义部分     -->
    </nz-form-item>
    <nz-form-item *jdDyFormColumnDef="let control; let model = model name 'INPUT_NUMBER'">
        <!--   省略控件定义部分     -->
    </nz-form-item>
    <!--   省略控件定义部分 假设还有很多控件类型     -->
    <jd-form-layout>
        <form nz-form nzLayout="vertical" [formGroup]="dyForm.formArea">
            <div>
                <div>
                    <!--      controlName1 在表单模型中定义好的              -->
                    <ng-container jdDyFormLayoutItemName="controlName1"></ng-container>                
                </div>
            </div>
            <div>
                <div>
                    <!--      controlName2 在表单模型中定义好的              -->
                    <ng-container jdDyFormLayoutItemName="controlName2"></ng-container>                
                </div>
            </div>
            <!--      这个是@supine/dy-form-zorro所用的方式               -->
            <!--<ng-container *ngFor="let control of dyForm.options">
               <ng-container jdDyFormLayoutItemOutlet="{{control.name}}"></ng-container>
            </ng-container>-->
        </form>
    </jd-form-layout>
</jd-dy-form>
```
到此自定义布局就完成了 轻轻松松布局出任何想要的布局

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
  
      @InputModel<LoginModel>({label: '手机号码'})
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
    <!--此处省略布局代码-->
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
      {label: '保密', value: 0},
      {label: '男', value: 1},
      {label: '女', value: 2},
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
  
# 自定义验证
- 自定义同步验证器
    - 模型
    ```typescript
    import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
    import {InputModel} from '../decorator/input.model';
    
    export class LoginModel extends BaseFormModel {
      /* .... */
      @InputModel<LoginModel>({label: '用户名'})
      @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
      username = [null, [FormModel.userNameValidator], []];
    
      static userNameValidator = (control: FormControl): ValidationErrors | null => {
           if (control.value === 'JasonWood') {
              // '用户名已存在' 这是用来反馈用户的
              return { userName: '用户名已存在' };
           } else {
              return null
           }
      }
      
      /* .... */
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

- 自定义异步验证器
    - 模型
    ```typescript
    import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
    import {InputModel} from '../decorator/input.model';
    
    export class LoginModel extends BaseFormModel {
      /* .... */
      @InputModel<LoginModel>({label: '用户名'})
      @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
      username = [null, [], [FormModel.userNameAsyncValidator]];
    
      static userNameAsyncValidator = (control: FormControl) =>
        new Observable((observer: Observer<ValidationErrors | null>) => {
          setTimeout(() => {
            if (control.value === 'JasonWood') {
              // '用户名已存在' 这是用来反馈用户的
              observer.next({ userName: '用户名已存在' });
            } else {
              observer.next(null);
            }
              observer.complete();
            }, 3000);
      })
      /* .... */
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
    - 预览图
      ![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/async_validator_preview0.png)
      ![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/async_validator_preview1.png)
- 拓展内置验证器校验规则 - ***这种方式复用性强，对复用性有要求的可以用这种方式***  
***自定义的详细描述请参考*** [validator](https://github.com/chengdonghaipu/supine/tree/master/projects/validator)
```typescript
import {DY_FORM_VALIDATOR} from '@supine/dy-form';
@NgModule({
  declarations: [
    /* ... */
  ],
  imports: [
    /* ... */
  ],
  providers: [
    // XValidator这就是基于ZlValidator拓展的验证器
    // 自定义验证规则 在定义验证规则有详细描述
    {provide: DY_FORM_VALIDATOR, useValue: XValidator}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```
# 填充表单
```typescript
  ngOnInit(): void {
    const {formValue, type} = this.data;
    this.dyFormRef.executeModelUpdate();

    this.dyFormRef.model // model 表单模型实例
      .withAttachValue(formValue || {}) // 将要给表单赋值的数据
      .withActionType(type) // 类型  比如新增或者修改
      .patchValue(); // 当表单初始化后会进行表单填充
  }
```

# 动态控制表单模型
modelUpdateHook(不常用，但很有用) - 动态控制表单模型
- 表单模型
```typescript
import {
BaseFormModel,
ValidatorRule,
SelectOptionContent,
InputNumberGroupModel,
InputModel
} from '@supine/dy-form';

export class MapUtilFormModel extends BaseFormModel {
  areaTypeContent: SelectOptionContent[] = [
    { label: '卸矿区', value: 'UnloadMineralArea' },
    { label: '装载区', value: 'LoadArea' },
    { label: '道路', value: 'Road' },
    { label: '可通行区域', value: 'PassableArea' },
    { label: '不可通行区域', value: 'ImpassableArea' }
  ];

  _roadType = [
    { label: '主线', value: 0 },
    { label: '支线', value: 1 },
    { label: '连接线', value: 2 }
  ];

  _capacity = [
    { label: '单车道', value: 1 },
    { label: '双车道', value: 2 }
  ];

  // 路口类型
  crossingType = [
    { label: '十字路口', value: 0 },
    { label: '丁字路口', value: 1 }
  ];
  // 排土类型
  _unloadWasteType = [
    { label: '边缘式', value: 'cliff' },
    { label: '定点式', value: 'point' }
  ];
  // 矿物类型
  mineralType = [];

  @SelectModel<MapUtilFormModel>({
    label: '区域类型',
    initHook: (that, context) => that.optionContent = context.areaTypeContent
  })
  @ValidatorRule('required', { required: '请选择区域类型' })
  areaType = [null];

  @InputModel({ label: '名称' })
  @ValidatorRule(['required&maxLength:20'], { maxLength: '最大输入20个字符', required: '请输入单元名称' })
  name = [null];

  // hide: true 隐藏控件
  @InputModel({ label: '区域编号', hide: true })
  areaId = [null];

  @InputNumberGroupModel<MapUtilFormModel>({
    label: '限速',
    addOnAfter: 'km/h',
    max: 100, min: 0,
    precision: 2,
    // 当类型为 ImpassableArea 限速禁用
    initHook: (that, context) => that.disabled = context.actionType === 'ImpassableArea'
  })
  @ValidatorRule(['required&max:100&min:0'], { max: '最大值为100', min: '最小值为0', required: '请输入区域限速' })
  speed = [0];

  @InputNumberGroupModel<MapUtilFormModel>({
    label: '车数量限制',
    addOnAfter: '辆',
    max: 100, min: 0,
    precision: 2,
  })
  @ValidatorRule(['required&max:100&min:0'], { max: '最大值为100', min: '最小值为0', required: '请输入车数量限制' })
  vehicleMax = [10];

  @SelectModel<MapUtilFormModel>({
    label: '装载类型',
    initHook: (that, context) => that.optionContent = context.mineralType
  })
  @ValidatorRule('required', { required: '请选择装载类型' })
  loadType = [null];

  @SelectModel<MapUtilFormModel>({
    label: '排土类型',
    aliasName: 'type',
    initHook: (that, context) => that.optionContent = context._unloadWasteType
  })
  @ValidatorRule('required', { required: '请选择装载类型' })
  unloadWasteType = [null];

  @InputNumberModel({ label: '排土次数上限', addOnAfter: '次' })
  @ValidatorRule(['max:999'], { max: '最大排土次数999' })
  unloadMax = [null];

  @SelectModel<MapUtilFormModel>({
    label: '卸矿类型',
    initHook: (that, context) => that.optionContent = context.mineralType
  })
  @ValidatorRule(['required'], { required: '请选择卸矿类型' })
  unloadType = [null];

  @SelectModel<MapUtilFormModel>({
    label: '道路类型',
    aliasName: 'type',
    initHook: (that, context) => that.optionContent = context._roadType
  })
  @ValidatorRule(['required'], { required: '请选择道路类型' })
  roadType = [null];

  @SelectModel<MapUtilFormModel>({
    label: '容量',
    initHook: (that, context) => that.optionContent = context._capacity
  })
  @ValidatorRule(['required'], { required: '请选择容量' })
  capacity = [null];

  @SelectModel<MapUtilFormModel>({
    label: '路口类型',
    aliasName: 'type', // 控件别名 表单真实的key 也就是获取表单value的时候该控件对应的key是type而不是junctionType
    initHook: (that, context) => that.optionContent = context.crossingType
  })
  @ValidatorRule(['required'], { max: '请选择路口类型' })
  junctionType = [null];
  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: any[]): FormControlConfig[] | void {
    const typeMap = {
      create: ['areaType', 'speed', 'name'], // actionType==='create' 显示 'areaType', 'speed', 'name'这几个控件 以下以此类推
      ParkingLot: ['speed', 'name', 'areaId'],
      UnloadMineralArea: ['speed', 'name', 'areaId'],
      UnloadWasteArea: ['speed', 'name', 'unloadWasteType', 'unloadMax', 'areaId'],
      // 编号、类型、名称、限速、车数量限制
      LoadArea: ['areaType', 'speed', 'name'/*, 'loadType'*//*, 'areaId'*/, 'vehicleMax'],
      ImpassableArea: ['speed', 'name', 'areaId'],
      PassableArea: ['speed', 'name', 'areaId'],
      Road: ['speed', 'name', 'roadType', 'capacity', 'areaId'],
      Junction: ['speed', 'name', 'junctionType', 'areaId']
    };
    const controls = typeMap[this.actionType];
    return model.filter(value => controls.includes(value.name));
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
- 组件
```typescript
import {Component, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';
import {MapUtilFormModel} from './form.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dyFormRef = new DyFormRef(MapUtilFormModel, {mode: 'vertical'});

  ngOnInit(): void {
  }

  constructor() {
    // 附加类型
    this.dyFormRef.model.withActionType('create');
    // 执行这行代码才会渲染  会执行表单模型中的modelUpdateHook
    this.dyFormRef.executeModelUpdate();
  }
}

```

- 预览图
  ![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/model_update_hook_preview0.png)
  ![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/model_update_hook_preview1.png)

