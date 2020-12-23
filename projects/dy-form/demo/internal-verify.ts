import {Component, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';
import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
import {InputModel} from './basic';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required&maxLength:15&minLength:4'], {required: '用户名字段是必填的', maxLength: '用户名长度最多为15个字符', minLength: '用户名长度最少为4个字符'})
  username = [null];
}

@Component({
  selector: 'nz-demo-dy-form-internal-verify',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef"></nz-zorro-dy-form>
  `,
  styles: [
    `
    `
  ]
})
export class NzDemoDyFormInternalVerifyComponent implements OnInit {
  // 第三步: 在组件中定义dyFormRef属性
  dyFormRef = new DyFormRef(LoginModel);

  ngOnInit(): void {
    // 第四步 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();
  }
}
