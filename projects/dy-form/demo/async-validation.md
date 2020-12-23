---
order: 5
title:
  zh-CN: 自定义异步校验器
  en-US: Customize Size
---

## zh-CN

自定义异步校验器也可以结合内置校验器使用

```typescript
export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required&maxLength:15&minLength:4'], {required: '用户名字段是必填的', maxLength: '用户名长度最多为15个字符', minLength: '用户名长度最少为4个字符'})
  username = [null, [], [LoginModel.userNameAsyncValidator]];

   static userNameAsyncValidator = (control: FormControl) =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
         setTimeout(() => {
            if (control.value === 'JasonWood') {
              // '用户名已存在' 这是用来反馈用户的
              observer.next({ userName: '用户名已存在' });
            } else {
              observer.next(null);
            }
              observer.complete();
            }, 3000);
   })
}
```

## en-US

Custom spacing size.
