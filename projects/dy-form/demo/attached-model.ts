import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef, ControlModel, FormControlConfig} from '@supine/dy-form';
import {InputModel} from './basic';

export class CommonModel extends BaseFormModel {
  @InputModel<CommonModel>({label: 'common'})
  common = [null];

  @InputModel<CommonModel>({label: 'common1'})
  common1 = [null];

  @InputModel<CommonModel>({label: 'common2'})
  common2 = [null];
}

@ControlModel({models: [CommonModel]})
export class FormModelAttached extends BaseFormModel {

  @InputModel<CommonModel>({label: '新的'})
  newFiled = [null];
}

@Component({
  selector: 'nz-demo-dy-form-common-model',
  template: `
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
export class NzDemoDyFormCommonModelOtherComponent implements OnInit {
  dyFormRef = new DyFormRef(CommonModel);

  ngOnInit(): void {
    this.dyFormRef.executeModelUpdate();
  }

}

@Component({
  selector: 'nz-demo-dy-form-new-model',
  template: `
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
export class NzDemoDyFormNewModelOtherComponent implements OnInit {
  dyFormRef = new DyFormRef(FormModelAttached);

  ngOnInit(): void {
    this.dyFormRef.executeModelUpdate();
  }
}

@Component({
  selector: 'nz-demo-dy-form-attached-model',
  template: `
    <div>这是公共模型:</div>
    <nz-demo-dy-form-common-model></nz-demo-dy-form-common-model>
    <div>这个是复用了公共模型后拓展的模型:</div>
    <nz-demo-dy-form-new-model></nz-demo-dy-form-new-model>
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
export class NzDemoDyFormAttachedModelComponent {
}
