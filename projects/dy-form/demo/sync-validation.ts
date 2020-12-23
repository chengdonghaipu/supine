import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef} from '@supine/dy-form';
import {InputModel} from './basic';
import {FormControl, ValidationErrors} from '@angular/forms';


export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  username = [null, [LoginModel.userNameValidator], []];

  static userNameValidator = (control: FormControl): ValidationErrors | null => {
    if (control.value === 'JasonWood') {
      // '用户名已存在' 这是用来反馈用户的
      return { userName: '用户名已存在' };
    } else {
      return null;
    }
  }
}


@Component({
  selector: 'nz-demo-dy-form-sync-validation',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" #dyForm></nz-zorro-dy-form>
  `
})
export class NzDemoDyFormSyncValidationComponent implements OnInit {
  // 第三步: 在组件中定义dyFormRef属性
  dyFormRef = new DyFormRef(LoginModel);

  ngOnInit(): void {
    // 第四步 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();
  }
}
