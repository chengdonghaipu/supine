import {Component, OnInit} from '@angular/core';
import {InputModel, ZorroDyFormRef} from '@supine/dy-form-zorro';
import {BaseFormModel, ValidatorRule} from '@supine/dy-form';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required'], {required: '用户名字段是必填的'})
  username = [null];

  @InputModel<LoginModel>({label: '邮箱'})
  @ValidatorRule(['required&email'], {required: '手机号码字段是必填的', email: '请填写正确的邮箱格式'})
  email = [null];

  @InputModel<LoginModel>({label: '手机号码'})
  @ValidatorRule(['required&phoneNum'], {required: '手机号码字段是必填的', phoneNum: '请填写正确的手机号码'})
  phone = [null];
}

@Component({
  selector: 'nz-demo-dy-form-zorro-basic',
  template: `
    <nz-radio-group [ngModel]="formLayout" (ngModelChange)="ngModelChange($event)">
      <label nz-radio-button [nzValue]="'horizontal'">Horizontal</label>
      <label nz-radio-button [nzValue]="'vertical'">Vertical</label>
      <label nz-radio-button [nzValue]="'inline'">Inline</label>
    </nz-radio-group>
    <br>
    <jd-dy-form-zorro [dyFormRef]="dyFormRef"></jd-dy-form-zorro>
  `,
  styles: [
    `
      nz-radio-group {
        margin-bottom: 15px;
      }

      nz-zorro-dy-form {
        display: block;
        max-width: 350px;
      }

      :host ::ng-deep [nz-form]:not(.ant-form-inline):not(.ant-form-vertical) {
        max-width: 600px;
      }
      :host ::ng-deep .ant-form-horizontal .ant-form-item-label {
        flex: 1;
      }
      :host ::ng-deep .ant-form-horizontal .ant-form-item-control {
        flex: 2;
      }
    `
  ]
})
export class NzDemoDyFormZorroBasicComponent implements OnInit {
  formLayout = 'vertical';

  dyFormRef = new ZorroDyFormRef(LoginModel, {mode: 'vertical'});

  ngModelChange(layout: 'vertical' | 'horizontal' | 'inline') {
    // this.dyFormRef.mode = layout;
    this.dyFormRef.setLayout(layout);
  }

  ngOnInit(): void {
    this.dyFormRef.executeModelUpdate();
  }
}
