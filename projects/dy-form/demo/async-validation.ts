import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef} from '@supine/dy-form';
import {InputModel} from './basic';
import {FormControl, ValidationErrors} from '@angular/forms';
import {Observable, Observer} from 'rxjs';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  username = [null, [], [LoginModel.userNameAsyncValidator]];

  static userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // '用户名已存在' 这是用来反馈用户的
          observer.next({userName: '用户名已存在'});
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 3000);
    })
}


@Component({
  selector: 'nz-demo-dy-form-async-validation',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" #dyForm></nz-zorro-dy-form>
  `
})
export class NzDemoDyFormAsyncValidationComponent implements OnInit {
  // 第三步: 在组件中定义dyFormRef属性
  dyFormRef = new DyFormRef(LoginModel);

  ngOnInit(): void {
    // 第四步 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();
  }
}
