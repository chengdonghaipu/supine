import {BaseFormModel, FormControlConfig, GroupModel, LayoutGroupModel, ValidatorRule} from '@supine/dy-form';
import {InputGroupModel, InputModel, SelectGroupModel} from '@supine/dy-form-zorro';
import {Validators} from '@angular/forms';

export class FormModel extends BaseFormModel {
  /*@InputModel<FormModel>({label: '矿岩名称5', updateOn: 'change'})
  @ValidatorRule(['required&max:999'], {max: '最大排土次数999', required: '必传'})
  mineralName = [null];

  @InputModel<FormModel>({label: '矿岩名称6'})
  mineralName6 = [null, [Validators.required]];

  @InputModel<FormModel>({label: '矿2'})
  mineralName1 = [null];

  @InputModel<FormModel>({label: '矿岩名称3'})
  mineralName2 = [null];

  @InputGroupModel({label: '矿岩名称4', addOnAfter: 'RGB'})
  mineralName3 = [3];
  @SelectGroupModel({label: '矿', addOnAfter: 'RGB', optionContent: [{label: 'heihei', value: 'hiehie'}]})
  mineralName31 = [3];*/
  @LayoutGroupModel({label: '手机号码'})
  layout;

  @InputModel<FormModel>({label: '用户名'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  username = [null];

  @InputModel<FormModel>({label: '用户名', parent: 'layout'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  phone = [null];

  @InputModel<FormModel>({label: '密码'})
  @ValidatorRule(['required&max:15&min:4'], {required: '密码字段是必填的', max: '密码长度最多为15个字符', min: '密码长度最少为4个字符'})
  password = [null];
  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: any[]): FormControlConfig[] | void {
    return model;
  }
}
