import {BaseFormModel, CustomModel, FormControlConfig, GroupModel, LayoutGroupModel, ValidatorRule} from '@supine/dy-form';
import {
  DatePickerModel,
  InputGroupModel,
  InputModel,
  InputNumberGroupModel,
  InputNumberModel,
  SelectGroupModel,
  SelectModel,
  RangePickerModel,
  TimePickerModel, TextareaModel
} from '@supine/dy-form-zorro';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {filter, map} from 'rxjs/operators';

export class FormModel extends BaseFormModel {
  @InputModel<FormModel>({label: 'input'})
  input = [null];

  @InputGroupModel<FormModel>({label: 'inputGroup'})
  inputGroup = [null];

  @InputNumberModel<FormModel>({label: 'inputNumber'})
  inputNumber = [null];

  @InputNumberGroupModel<FormModel>({label: 'inputNumberGroup'})
  inputNumberGroup = [null];

  @TextareaModel<FormModel>({label: 'textarea'})
  textarea = [null];

  @SelectModel<FormModel>({label: 'select', optionContent: [{label: '男', value: 1}, {label: '女', value: 1}]})
  select = [null];

  @SelectGroupModel<FormModel>({label: 'selectGroup', optionContent: [{label: '男', value: 1}, {label: '女', value: 1}]})
  selectGroup = [null];

  @DatePickerModel<FormModel>({label: 'datePicker'})
  datePicker = [null];

  @RangePickerModel<FormModel>({label: 'rangePicker', showTime: true})
  rangePicker = [null];

  @TimePickerModel<FormModel>({label: 'timePicker'})
  timePicker = [new Date()];

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


  /**
   * 结合我封装的HTTP模块 可轻松实现批量对接与表单相关的接口
   * HTTP模块 目前还没开源
   * 即便不使用我封装的HTTP模块 按照以下模板 也容易实现
   */
  httpRequest() {
    /* .... */
  }
}
