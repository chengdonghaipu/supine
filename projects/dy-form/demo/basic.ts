import {AfterContentInit, Component, ContentChildren, Input, OnInit, QueryList, TemplateRef, ViewChild} from '@angular/core';

/**
 * 第一步: 实现控件模型(以input为例)
 */

import {
  BaseModel,
  ModelPartial,
  Const,
  DyFormComponent,
  DyFormHeaderDef,
  DyFormFooterDef,
  DyFormRef,
  DyFormColumnDef, FormControlConfig
} from '@supine/dy-form';

export class InputModelControl<M> extends BaseModel<M> {
  /**
   * type 必须要实现 不同的type代表不同的控件
   */
  @Const('INPUT') // 表示type只能为INPUT 不允许被修改
  type!: string;

  /**
   * 只读 如果为true 表示该控件为只读状态
   */
  readonly = false;

  /**
   * 输入框的类型
   */
  inputType: 'text' | 'password' = 'text';

  /**
   * 如果 InputModelControl 还需要其他属性 可以按照readonly 的方式进行
   */

  set placeHolder(value: string) {
    this._placeHolder = value;
  }

  get placeHolder() {
    return this._placeHolder || `请输入${this.label}`;
  }

  constructor(init?: ModelPartial<InputModelControl<M>>) {
    super();
    this.init(init);
  }
}

/**
 * 第二步: 实现控件模型对应的装饰器(以input为例)
 */

import {BaseDecorator} from '@supine/dy-form';
import {AbstractControl, FormControl, NgModel} from '@angular/forms';

export function InputModel<M>(model?: ModelPartial<InputModelControl<M>>): PropertyDecorator {
  const newModel = new InputModelControl();
  if (model) {
    Object.assign(newModel, model);
  }
  return BaseDecorator(newModel);
}

/**
 * 第三步: 创建一个Angular组件&并配置模板
 */

@Component({
  selector: 'nz-zorro-dy-form',
  template: `
    <!--通用错误提示-->
    <ng-template #errorTpl let-control>
      <ng-container *ngIf="hasError(control)">
        {{getError(control)}}
      </ng-container>
    </ng-template>
    <ng-template #label let-model>
      <nz-form-label [nzRequired]="model.required"
                     jdDyFormLabelDef
                     [ngClass]="model.labelClass"
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
                         [nzErrorTip]="errorTpl"
                         [nzHasFeedback]="model.hasFeedback"
                         [nzExtra]="model.extra"
                         [nzValidatingTip]="model.validatingTip"
                         [ngStyle]="model.controlStyle"
                         [nzValidateStatus]="control"
                         [ngClass]="model.controlClass">
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
  `
})
export class NzZorroDyFormOtherComponent implements AfterContentInit {
  @ViewChild(DyFormComponent, {static: true}) dyForm: DyFormComponent;

  @ViewChild('errorTpl', {static: true}) errorTpl: TemplateRef<{ $implicit: AbstractControl | NgModel }>;

  @ViewChild('label', {static: true}) labelTpl: TemplateRef<void>;

  @ViewChild('inputControl', {static: true}) inputTpl: TemplateRef<void>;

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

  ngAfterContentInit(): void {
    // 增加form Footer 可以有多行
    this._formFooterDefs.forEach(item => this.dyForm.addFooterRowDef(item));
    // 增加form Header 可以有多行
    this._formHeaderDefs.forEach(item => this.dyForm.addHeaderRowDef(item));
    // 注册表单控件模板
    this._formColumnDefs.forEach(item => this.dyForm.addColumnDef(item));
  }
}

/**
 * 使用封装好的动态表单
 * 第一步: 定义表单模型
 * 第二步: 在HTML中声明动态表单
 * 第三步: 在组件中定义dyFormRef属性
 * 第四步: dyFormRef.executeModelUpdate();执行渲染
 */


/**
 * 第一步: 定义表单模型
 */
import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
import {filter, map} from 'rxjs/operators';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required&maxLength:15&minLength:4'], {required: '用户名字段是必填的', maxLength: '用户名长度最多为15个字符', minLength: '用户名长度最少为4个字符'})
  username = [null];

  @InputModel<LoginModel>({label: '密码'})
  @ValidatorRule(['required&maxLength:15&minLength:4'], {required: '密码字段是必填的', maxLength: '密码长度最多为15个字符', minLength: '密码长度最少为4个字符'})
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
        // 额外处理
        map(() => {})
      );
  }
}
@Component({
  selector: 'nz-demo-dy-form-basic',
  template: `
    <!--    第二步: 在HTML中声明动态表单-->
    <nz-zorro-dy-form [dyFormRef]="dyFormRef"></nz-zorro-dy-form>
  `,
  styles: []
})
export class NzDemoDyFormBasicComponent implements OnInit {
  // 第三步: 在组件中定义dyFormRef属性
  dyFormRef = new DyFormRef(LoginModel);

  ngOnInit(): void {
    // 第四步 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();
  }
}
