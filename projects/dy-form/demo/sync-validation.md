---
order: 4
title:
  zh-CN: 自定义同步校验器
  en-US: Customize Size
---

## zh-CN

自定义同步校验器也可以结合内置校验器使用

```typescript
export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required&maxLength:15&minLength:4'], {required: '用户名字段是必填的', maxLength: '用户名长度最多为15个字符', minLength: '用户名长度最少为4个字符'})
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
```

## en-US

Custom spacing size.
