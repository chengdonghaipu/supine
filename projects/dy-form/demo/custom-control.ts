import {Component, OnInit} from '@angular/core';
import {BaseFormModel, CustomModel, DyFormRef, ValidatorRule} from '@supine/dy-form';
import {InputModel} from './basic';
export class LoginModel extends BaseFormModel {
  // customPro 为自定义模型属性 将作为模板上下文属性 在模板中可以访问到
  // 可以定义多个自定义属性
  // type 默认为CUSTOM 允许修改
  @CustomModel({label: '自定义', type: 'custom', customPro: '我是自定义的!'})
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
      <nz-form-item *jdDyFormColumnDef="let control; let model = model name 'custom'">
        <ng-template [ngTemplateOutlet]="dyForm.labelTpl" [ngTemplateOutletContext]="{$implicit: model}"></ng-template>
        <nz-form-control  jdDyFormControlDef
                          [nzErrorTip]="dyForm.errorTpl">
          <nz-input-group [nzAddOnBefore]="addOnBeforeTemplate">
            <ng-template #addOnBeforeTemplate>
              <nz-select class="phone-select" [ngModel]="'+86'">
                <nz-option nzLabel="+86" nzValue="+86"></nz-option>
                <nz-option nzLabel="+87" nzValue="+87"></nz-option>
              </nz-select>
            </ng-template>
            <!--        customPro 为模型中自定义属性-->
            <input [formControl]="control" [placeholder]="model.customPro" nz-input />
          </nz-input-group>
        </nz-form-control>
      </nz-form-item>
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
