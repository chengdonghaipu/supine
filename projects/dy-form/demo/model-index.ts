import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef} from '@supine/dy-form';
import {InputModel} from './basic';

export class OrderModel extends BaseFormModel {
  @InputModel<OrderModel>({label: 'filed', order: 3})
  filed = [null];

  @InputModel<OrderModel>({label: 'filed1', order: 2})
  filed1 = [null];

  @InputModel<OrderModel>({label: 'filed2', order: 1})
  filed2 = [null];
}

@Component({
  selector: 'nz-demo-dy-form-model-index',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" layout="horizontal"></nz-zorro-dy-form>
  `,
  styles: [
    `
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
export class NzDemoDyFormModelIndexComponent implements OnInit {
  dyFormRef = new DyFormRef(OrderModel);

  ngOnInit() {
    this.dyFormRef.executeModelUpdate();
  }
}
