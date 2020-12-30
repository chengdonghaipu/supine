import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef, ControlModel, FormControlModel, ModelUpdateHelper} from '@supine/dy-form';
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

@ControlModel({models: [FormModel]})
export class FormModelByModelParams extends BaseFormModel {

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlModel[], ...params: string[]): FormControlModel[] | void {
    ModelUpdateHelper.enabledByKeys(params, model, true);
    return model;
  }
}

@Component({
  selector: 'nz-demo-dy-form-by-model-params-helper',
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
export class NzDemoDyFormByModelParamsHelperOtherComponent implements OnInit {
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
  selector: 'nz-demo-dy-form-helper',
  template: `
    <div>禁用/启用控件:</div>
    <nz-demo-dy-form-by-model-params-helper></nz-demo-dy-form-by-model-params-helper>
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
export class NzDemoDyFormHelperComponent {
}
