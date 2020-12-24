import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef, ValidatorRule} from '@supine/dy-form';
import {InputModel} from './basic';
import {FormControl} from '@angular/forms';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '邮箱'})
  @ValidatorRule(['required&email'], {required: '手机号码字段是必填的', email: '请填写正确的邮箱格式'})
  email = [null];

  @InputModel<LoginModel>({label: '密码', inputType: 'password'})
  @ValidatorRule(['required&maxLength:15&minLength:4'], {required: '手机号码字段是必填的', maxLength: '密码长度最多为15个字符', minLength: '密码长度最少为4个字符'})
  password = [null];
}


@Component({
  selector: 'nz-demo-dy-form-header-footer',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" layout="horizontal">
      <ng-container *jdDyFormHeaderDef>
        <div class="form-header">
          <h2>欢迎登陆</h2>
        </div>
      </ng-container>
      <ng-container *jdDyFormFooterDef>
        <div nz-row class="login-form-margin">
          <div nz-col [nzSpan]="12">
            <label nz-checkbox [formControl]="remember">
              <span>记住登陆</span>
            </label>
          </div>
          <div nz-col [nzSpan]="12">
            <a class="login-form-forgot">忘记密码</a>
          </div>
        </div>
        <button nz-button class="login-form-button login-form-margin" [nzType]="'primary'">登 陆</button>
        Or <a> register now! </a>
      </ng-container>
    </nz-zorro-dy-form>
  `,
  styles: [
    `
      .login-form-button {
        width: 100%;
      }
      nz-zorro-dy-form {
        display: block;
        max-width: 350px;
      }
      .form-header {
        text-align: center;
        margin: 15px;
      }
      .login-form-forgot {
        float: right;
      }
      .login-form-margin {
        margin-bottom: 8px;
      }
    `
  ]
})
export class NzDemoDyFormHeaderFooterComponent implements OnInit {
  remember = new FormControl(true);

  dyFormRef = new DyFormRef(LoginModel);

  ngOnInit(): void {
    this.dyFormRef.executeModelUpdate();
  }

}
