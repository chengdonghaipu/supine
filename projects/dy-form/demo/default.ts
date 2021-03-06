import {Component, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';
import {BaseFormModel} from '@supine/dy-form';
import {InputModel} from './basic';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  username = ['苏仨'];

  @InputModel<LoginModel>({label: '禁用用户名'})
  username1 = [{disabled: true, value: '苏仨'}];
}

@Component({
  selector: 'nz-demo-dy-form-default',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef"></nz-zorro-dy-form>
  `,
  styles: [
    `
    `
  ]
})
export class NzDemoDyFormDefaultComponent implements OnInit {
  // 第三步: 在组件中定义dyFormRef属性
  dyFormRef = new DyFormRef(LoginModel);

  ngOnInit(): void {
    // 第四步 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();
  }
}
