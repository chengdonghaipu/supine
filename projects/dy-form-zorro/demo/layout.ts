import {Component, OnInit} from '@angular/core';
import {
  InputModel,
  ZorroDyFormRef
} from '@supine/dy-form-zorro';
import {BaseFormModel} from '@supine/dy-form';

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

@Component({
  selector: 'nz-demo-dy-form-zorro-layout',
  template: `
    <jd-dy-form-zorro [dyFormRef]="dyFormRef" #dyFormZorro>
      <jd-form-layout>
        <form nz-form nzLayout="horizontal" [formGroup]="dyFormZorro?.dyForm.formArea">
          <div>
            <ng-container jdDyFormLayoutItemName="filed"></ng-container>
            <ng-container jdDyFormLayoutItemName="filed1"></ng-container>
          </div>
          <div>
            <ng-container jdDyFormLayoutItemName="filed2"></ng-container>
            <ng-container jdDyFormLayoutItemName="filed3"></ng-container>
          </div>
          <div>
            <ng-container jdDyFormLayoutItemName="filed4"></ng-container>
            <ng-container jdDyFormLayoutItemName="filed5"></ng-container>
          </div>
        </form>
      </jd-form-layout>
    </jd-dy-form-zorro>
  `,
  styles: [
    `
      jd-dy-form-zorro {
        display: block;
        max-width: 700px;
      }
      [nz-form] > div {
        border: 1px solid #5c6b77;
        padding: 15px 100px 0 15px;
      }
      :host ::ng-deep .ant-form-horizontal .ant-form-item-label {
        flex: 1;
      }
      :host ::ng-deep .ant-form-horizontal .ant-form-item-control {
        flex: 3;
      }
    `
  ]
})
export class NzDemoDyFormZorroLayoutComponent implements OnInit {

  // 自定义布局 模式必须设置 mode: 'custom'
  dyFormRef = new ZorroDyFormRef(FormModel, {mode: 'custom'});

  ngOnInit(): void {
    this.dyFormRef.executeModelUpdate();
  }
}
