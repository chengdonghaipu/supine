import {Component, OnInit} from '@angular/core';
import {DY_FORM_VALIDATOR, DyFormRef} from '@supine/dy-form';
import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
import {InputModel} from './basic';
import {DefaultMessage, Rule, TargetMap, Validator, ZlValidator, ZlValidatorRule, CheckParamNotException} from '@supine/validator';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  // equalHello规则是拓展后才有的
  @ValidatorRule(['equalHello'], {equalHello: '用户名字段必须为hello'})
  username = [null];
}

export class ExpandValidatorRule {
  // 验证规则默认提示信息
  /**
   * @param filedName 被验证的字段名称 可能是嵌套的
   * @param ruleName 规则名称
   * @param params 规则参数
   * @param value 被验证的值
   */
  @DefaultMessage()
  defaultMessage(filedName: string, ruleName: string, params, value): string {
    const typeMsg = {
      equalHello: `${filedName} 必须是hello`,
    };

    return typeMsg[ruleName];
  }

  /**
   * @param value 被验证的数据 不用担心是怎么传过来的 因为这个是验证器做的事
   * @param {string[]} params 验证的规则 不用担心是怎么传过来的 因为这个是验证器做的事
   * @param {Map<string, any>} targetMap 解析后数据 可以根据属性名获取对应的数据
   * @returns {string} 返回值可以为string 或者 boolean 当为 string 时
   * 自动将返回值作为自定义错误信息提示 如果验证失败请返回失败原因(字符串) 如果验证通过 请返回空字符''
   * 当为 boolean 时 为true说明验证失败 为false说明验证通过
   * 方法名hello 为验证规则的名称  后面可以跟参数 比如 hello:otherField
   * 装饰器 @Rule() 告诉验证 该方法为验证规则  如果没有声明该装饰器的方法  将不会拓展该规则
   * 例子: 实现equalHello规则 当value的值为hello 该规则才通过 否则失败
   */
  @Rule()
  equalHello(value, params, targetMap: TargetMap) {
    // 该规则不需要参数 如果传递了参数就会报错
    CheckParamNotException('equalHello', params);
    return value !== 'hello';
  }
}

@Validator({
  rules: [ZlValidatorRule, ExpandValidatorRule]
})
export class ExpandValidator extends ZlValidator {

}

@Component({
  selector: 'nz-demo-dy-form-expand-verify',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef"></nz-zorro-dy-form>
  `,
  styles: [
    `
    `
  ],
  providers: [
    // 此处注册 在实际开发中 应该在根模块中注册 如果在这里注册 会失败
    {provide: DY_FORM_VALIDATOR, useValue: ExpandValidator}
  ]
})
export class NzDemoDyFormExpandVerifyComponent implements OnInit {
  dyFormRef = new DyFormRef(LoginModel);

  ngOnInit(): void {
    this.dyFormRef.executeModelUpdate();
  }
}
