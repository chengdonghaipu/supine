import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef, LayoutGroupModel, ValidatorRule} from '@supine/dy-form';
import {InputModel} from './basic';

export class LoginModel extends BaseFormModel {
  // 布局容器 我们可以指定自定义类型 type=phone  默认值为LAYOUT_GROUP
  @LayoutGroupModel({type: 'phone'})
  layout;

  // parent: 'layout' 指定容器 layout
  @InputModel<LoginModel>({label: '手机号码', parent: 'layout'})
  @ValidatorRule(['required&phoneNum'], {required: '用户名字段是必填的', phoneNum: '请填写正确的手机号码'})
  phone = [null];
  // parent: 'layout' 指定容器 layout
  @InputModel<LoginModel>({label: '用户名', parent: 'layout'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  username = [null];
}


@Component({
  selector: 'nz-demo-dy-form-custom-control-group',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" #dyForm>
      <!--  phone 跟模型中的layout字段的元数据type是相对应的-->
      <!--  groupModel 包含布局容器内所有字控件的配置信息 比如我要访问容器内phone控件的配置可以这样访问 groupModel.phone-->
      <!--  childControl 包含布局容器内所有字控件的formControl 比如我要访问容器内phone控件可以这样访问 childControl.phone-->
      <ng-container *jdDyFormColumnDef="let model = model name 'phone', let groupModel = groupInfo, let childControl = childControl">
        <nz-form-item>
          <nz-form-control
            jdDyFormControlDef
            [nzValidateStatus]="childControl.phone"
            [nzErrorTip]="dyForm.errorTpl"
          >
            <nz-input-group [nzAddOnBefore]="addOnBeforeTemplate">
              <ng-template #addOnBeforeTemplate>
                <nz-select class="phone-select" [ngModel]="'+86'">
                  <nz-option nzLabel="+86" nzValue="+86"></nz-option>
                  <nz-option nzLabel="+87" nzValue="+87"></nz-option>
                </nz-select>
              </ng-template>
              <input [formControl]="childControl.phone" id="'phoneNumber'" style="width: 50%" nz-input/>
              <input [formControl]="childControl.username" style="width: 50%" nz-input/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
      </ng-container>
    </nz-zorro-dy-form>
  `
})
export class NzDemoDyFormCustomControlGroupComponent implements OnInit {
  // 第三步: 在组件中定义dyFormRef属性
  dyFormRef = new DyFormRef(LoginModel);

  ngOnInit(): void {
    // 第四步 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();
  }
}
