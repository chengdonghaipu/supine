import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef, ValidatorRule} from '@supine/dy-form';
import {InputModel} from './basic';
import {Observable, of} from 'rxjs';
import {concatMap, debounceTime, filter, map} from 'rxjs/operators';

interface HttpRequestMap {
  [key: string]: [
    (...params) => Observable<unknown>, any[]
  ];
}


export class UserModel extends BaseFormModel {
  @InputModel<UserModel>({label: '用户名'})
  @ValidatorRule(['required'], {required: '用户名字段是必填的'})
  username = [null];

  @InputModel<UserModel>({label: '邮箱'})
  @ValidatorRule(['required&email'], {required: '手机号码字段是必填的', email: '请填写正确的邮箱格式'})
  email = [null];

  @InputModel<UserModel>({label: '手机号码'})
  @ValidatorRule(['required&phoneNum'], {required: '手机号码字段是必填的', phoneNum: '请填写正确的手机号码'})
  phone = [null];

  updateUser(body, id) {
    console.log(body, id);
    // 模拟用户更新接口
    return of(null)
      .pipe(
        debounceTime(100),
        map(() => Object.assign({}, body, {id}))
      );
  }

  createUser(body) {
    // 模拟用户创建接口
    return of(null)
      .pipe(
        debounceTime(100),
        map(() => body)
      );
  }

  httpRequest(): Observable<unknown> {
    return this.updateValueAndValidity()
      .pipe(
        // 如果验证未通过 则过滤掉
        filter(value => value),
        concatMap(() => {
          // 获取表单数据 如果不能满足需要 可以在子类实现value的获取
          const body = super.value;
          // 获取提交表单的一些外部参数 比如更新的参数ID  attachValue 通过 model.withAttachValue(数据)进行设置
          const {id} = this.attachValue || {id: 0};

          // 一系列与表单相关的接口
          const httpRequestMap: HttpRequestMap = {
            update: [this.updateUser, [body, id]],
            create: [this.createUser, [body]],
          };

          const [handle, params] = httpRequestMap[this.actionType];

          return handle(...params);
        })
      );
  }
}

@Component({
  selector: 'nz-demo-dy-form-action-type',
  template: `
    <div style="margin-bottom: 15px">
      actionType:
      <nz-select [ngModel]="actionType" (ngModelChange)="ngModelChange($event)">
        <nz-option nzLabel="创建用户" nzValue="create"></nz-option>
        <nz-option nzLabel="修改用户" nzValue="update"></nz-option>
      </nz-select>
    </div>
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" style="display: inline-block"></nz-zorro-dy-form>
    <button nz-button nzType="primary" (click)="submit()">提交</button>
    <br>
    <code>
      {{result | json}}
    </code>
  `,
})
export class NzDemoDyFormActionTypeComponent implements OnInit {
  dyFormRef = new DyFormRef(UserModel);

  actionType = 'create';

  result = {};

  ngOnInit(): void {
    this.dyFormRef.executeModelUpdate();

    this.dyFormRef.model.withActionType(this.actionType);
  }

  ngModelChange(actionType: string) {
    const {model} = this.dyFormRef;

    if (actionType === 'create') {
      this.dyFormRef.reset();
      model.withActionType(actionType);
    } else {
      model.withActionType(actionType)
        .withAttachValue({
          username: '苏三',
          email: '1151849955@qq.com',
          phone: '15173818606',
          id: 10001
        }).patchValue();
    }
  }

  submit() {
    const {model: formModel} = this.dyFormRef;

    formModel.httpRequest()
      .subscribe((result) => this.result = result);
  }
}
