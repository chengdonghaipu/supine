import {Component, OnInit} from '@angular/core';
import {BaseFormModel, CustomModel, DyFormRef, ValidatorRule} from '@supine/dy-form';
import {InputModel} from './basic';
export class LoginModel extends BaseFormModel {
  // customPro 为自定义模型属性 将作为模板上下文属性 在模板中可以访问到
  // 可以定义多个自定义属性
  // type 默认为CUSTOM 允许修改
  @CustomModel({label: '自定义', type: 'custom', customPro: 'customPro'})
  custom = [null];

  @InputModel<LoginModel>({label: '禁用用户名'})
  @ValidatorRule(['required&maxLength:15&minLength:4'], {required: '用户名字段是必填的', maxLength: '用户名长度最多为15个字符', minLength: '用户名长度最少为4个字符'})
  username = [{disabled: true, value: '苏仨'}];
}


@Component({
  selector: 'nz-demo-dy-form-custom-control',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" #dyForm>
      <!--  name 'custom' 对应模型中的 type字段值-->
      <ng-container *jdDyFormColumnDef="let control; let model = model name 'custom'">
        <nz-form-item>
          <ng-template [ngTemplateOutlet]="dyForm.labelTpl" [ngTemplateOutletContext]="{$implicit: model}"></ng-template>
          <nz-form-control  jdDyFormControlDef
                            [nzErrorTip]="dyForm.errorTpl">
            <!--        customPro 为模型中自定义属性-->
            <input type="text" nz-input [formControl]="control" [placeholder]="model.customPro">
          </nz-form-control>
        </nz-form-item>
      </ng-container>
      <!--此处省略布局代码-->
    </nz-zorro-dy-form>
  `
})
export class NzDemoDyFormCustomControlComponent implements OnInit {
  // 第三步: 在组件中定义dyFormRef属性
  dyFormRef = new DyFormRef(LoginModel);

  ngOnInit(): void {
    // 第四步 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();
  }
}
