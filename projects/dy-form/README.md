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

# 基于@supine/dy-form 定制不同Angular UI框架的动态表单
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
    // 增加form Footer 可以有多行
    this._formFooterDefs.forEach(item => this.dyForm.addFooterRowDef(item));
    // 增加form Header 可以有多行
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
    // 获取表单数据 如果不能满足需要 可以在子类实现value的获取
    // const body = super.value;
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
dyFormRef = new DyFormRef(LoginModel, {mode: 'vertical'});
```

- 至此就可以看到我们想要的表单啦
  
