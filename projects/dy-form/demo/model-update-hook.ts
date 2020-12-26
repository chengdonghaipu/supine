import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef, AttachedModel, FormControlConfig} from '@supine/dy-form';
import {InputModel} from './basic';

export class FormModel extends BaseFormModel {
  @InputModel<FormModel>({label: 'filed'})
  filed = [null];

  @InputModel<FormModel>({label: 'filed1'})
  filed1 = [null];

  @InputModel<FormModel>({label: 'filed2'})
  filed2 = [null];

  @InputModel<FormModel>({label: 'filed3'})
  filed3 = [null];

  @InputModel<FormModel>({label: 'filed4'})
  filed4 = [null];

  @InputModel<FormModel>({label: 'filed5'})
  filed5 = [null];
}

@AttachedModel({models: [FormModel]})
export class FormModelByActionType extends BaseFormModel {

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: any[]): FormControlConfig[] | void {
    const groupMap = {
      group1: ['filed', 'filed1', 'filed2'],
      group2: ['filed', 'filed3', 'filed4'],
      group3: ['filed2', 'filed3', 'filed5'],
    };
    return model.filter(value => groupMap[this.actionType].includes(value.name));
  }
}

@AttachedModel({models: [FormModel]})
export class FormModelByModelParams extends BaseFormModel {

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: string[]): FormControlConfig[] | void {
    return model.filter(value => params.includes(value.name));
  }
}

@Component({
  selector: 'nz-demo-dy-form-by-action-type',
  template: `
    <nz-radio-group [(ngModel)]="group" (ngModelChange)="ngModelChange()">
      <label nz-radio-button [nzValue]="'group1'">group1</label>
      <label nz-radio-button [nzValue]="'group2'">group2</label>
      <label nz-radio-button [nzValue]="'group3'">group3</label>
    </nz-radio-group>
    <nz-checkbox-group [ngModel]="groupMap[group]"></nz-checkbox-group>
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" layout="horizontal"></nz-zorro-dy-form>
  `,
  styles: [
    `
      nz-radio-group, nz-checkbox-group {
        margin-bottom: 15px;
        margin-right: 15px;
      }
    `
  ]
})
export class NzDemoDyFormByActionTypeOtherComponent implements OnInit {
  group = 'group1';

  groupMap = {
    group1: [
      {label: 'filed', value: 'filed', checked: true, disabled: true},
      {label: 'filed1', value: 'filed1', checked: true, disabled: true},
      {label: 'filed2', value: 'filed2', checked: true, disabled: true},
    ],
    group2: [
      {label: 'filed', value: 'filed', checked: true, disabled: true},
      {label: 'filed3', value: 'filed3', checked: true, disabled: true},
      {label: 'filed4', value: 'filed4', checked: true, disabled: true},
    ],
    group3: [
      {label: 'filed2', value: 'filed2', checked: true, disabled: true},
      {label: 'filed3', value: 'filed3', checked: true, disabled: true},
      {label: 'filed5', value: 'filed5', checked: true, disabled: true},
    ],
  };

  dyFormRef = new DyFormRef(FormModelByActionType);

  ngModelChange() {
    this.dyFormRef.model.withActionType(this.group);
    this.dyFormRef.executeModelUpdate();
  }

  ngOnInit(): void {
    this.dyFormRef.model.withActionType(this.group);
    this.dyFormRef.executeModelUpdate();
  }

}

@Component({
  selector: 'nz-demo-dy-form-by-model-params',
  template: `
    <nz-checkbox-group [(ngModel)]="options" (ngModelChange)="ngModelChange()"></nz-checkbox-group>
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" layout="horizontal"></nz-zorro-dy-form>
  `,
  styles: [
    `
      nz-checkbox-group {
        margin-bottom: 15px;
      }
    `
  ]
})
export class NzDemoDyFormByModelParamsOtherComponent implements OnInit {
  options = [
    {label: 'filed', value: 'filed', checked: true},
    {label: 'filed1', value: 'filed1', checked: true},
    {label: 'filed2', value: 'filed2', checked: true},
    {label: 'filed3', value: 'filed3', checked: true},
    {label: 'filed4', value: 'filed4', checked: true},
    {label: 'filed5', value: 'filed5', checked: true},
  ];

  dyFormRef = new DyFormRef(FormModelByModelParams);

  get modelParams() {
    return this.options.filter(value => value.checked).map(value => value.value);
  }

  ngModelChange() {
    this.dyFormRef.executeModelUpdate(...this.modelParams);
  }

  ngOnInit(): void {
    this.dyFormRef.executeModelUpdate(...this.modelParams);
  }

}


@Component({
  selector: 'nz-demo-dy-form-model-update-hook',
  template: `
    <div>通过actionType动态控制:</div>
    <nz-demo-dy-form-by-action-type></nz-demo-dy-form-by-action-type>
    <div>通过模型参数动态控制:</div>
    <nz-demo-dy-form-by-model-params></nz-demo-dy-form-by-model-params>
  `,
  styles: [
    `
      :host > div {
        padding: 15px 0;
      }

      :host ::ng-deep .ant-form-horizontal .ant-form-item-label {
        flex: 1;
      }

      :host ::ng-deep .ant-form-horizontal .ant-form-item-control {
        flex: 2;
      }

      :host ::ng-deep [nz-form]:not(.ant-form-inline):not(.ant-form-vertical) {
        max-width: 600px;
      }
    `
  ]
})
export class NzDemoDyFormModelUpdateHookComponent {
}
