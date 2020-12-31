import {Component, OnInit} from '@angular/core';
import {
  DatePickerModel,
  InputGroupModel,
  InputModel,
  InputNumberGroupModel,
  InputNumberModel, RangePickerModel,
  SelectGroupModel, SelectModel,
  TextareaModel, TimePickerModel,
  ZorroDyFormRef
} from '@supine/dy-form-zorro';
import {BaseFormModel} from '@supine/dy-form';

export class FormModel extends BaseFormModel {
  @InputModel<FormModel>({label: 'input'})
  input = [null];

  @InputGroupModel<FormModel>({label: 'inputGroup', addOnAfter: 'Y'})
  inputGroup = [null];

  @InputNumberModel<FormModel>({label: 'inputNumber'})
  inputNumber = [null];

  @InputNumberGroupModel<FormModel>({label: 'inputNumberGroup', addOnAfter: '$'})
  inputNumberGroup = [null];

  @TextareaModel<FormModel>({label: 'textarea'})
  textarea = [null];

  @SelectModel<FormModel>({label: 'select', optionContent: [{label: '男', value: 1}, {label: '女', value: 2}]})
  select = [null];

  @SelectGroupModel<FormModel>({label: 'selectGroup', addOnAfter: 'UC', optionContent: [{label: '男', value: 1}, {label: '女', value: 2}]})
  selectGroup = [null];

  @DatePickerModel<FormModel>({label: 'datePicker'})
  datePicker = [null];

  @RangePickerModel<FormModel>({label: 'rangePicker', showTime: true})
  rangePicker = [null];

  @TimePickerModel<FormModel>({label: 'timePicker'})
  timePicker = [new Date()];
}

@Component({
  selector: 'nz-demo-dy-form-zorro-all-control',
  template: `
    <jd-dy-form-zorro [dyFormRef]="dyFormRef"></jd-dy-form-zorro>
  `,
  styles: [
    `
      jd-dy-form-zorro {
        display: block;
        max-width: 700px;
      }
      :host ::ng-deep .ant-form-horizontal .ant-form-item-label {
        flex: 1;
      }
      :host ::ng-deep .ant-form-horizontal .ant-form-item-control {
        flex: 2;
      }
    `
  ]
})
export class NzDemoDyFormZorroAllControlComponent implements OnInit {

  dyFormRef = new ZorroDyFormRef(FormModel, {mode: 'horizontal'});

  ngOnInit(): void {
    this.dyFormRef.executeModelUpdate();
  }
}
