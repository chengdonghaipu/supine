import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef, ValidatorRule} from '@supine/dy-form';
import {InputModel} from './basic';

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
  selector: 'nz-demo-dy-form-patch-form',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef"></nz-zorro-dy-form>
    <br>
    <nz-zorro-dy-form [dyFormRef]="dyFormRef1"></nz-zorro-dy-form>
    <button nz-button nzType="primary" (click)="dyPatch()">动态填充表单</button>
    <button nz-button nzType="danger" (click)="reset()">重置</button>
  `,
  styles: [
    `
      nz-zorro-dy-form{
        display: inline-block !important;
        margin-bottom: 15px;
      }
      [nz-button] {
        margin-right: 15px;
      }
    `
  ]
})
export class NzDemoDyFormPatchFormComponent implements OnInit {
  dyFormRef = new DyFormRef(LoginModel);
  dyFormRef1 = new DyFormRef(LoginModel);

  ngOnInit(): void {
    // 第四步 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();
    this.dyFormRef1.executeModelUpdate();

    const formValue = {
      username: '苏三',
      email: '1151849955@qq.com',
      phone: '15173818606'
    };

    const type = 'update';

    this.dyFormRef.model // model 表单模型实例
      .withAttachValue(formValue) // 将要给表单赋值的数据
      .withActionType(type) // 类型  比如新增或者修改 后面会有demo
      .patchValue(); // 当表单初始化后会进行表单填充
  }

  dyPatch() {
    this.dyFormRef1.model.patchValue({
      username: '苏三',
      email: '1151849955@qq.com',
      phone: '15173818606'
    });
  }

  reset() {
    this.dyFormRef1.reset();
  }
}
