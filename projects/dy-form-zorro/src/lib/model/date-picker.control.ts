import {ModelPartial} from '@supine/dy-form';
import {DateControl} from './date.control';
import {TemplateRef} from '@angular/core';

export class DatePickerControl<M> extends DateControl<M> {
  /**
   * type 必须要实现 不同的type代表不同的控件
   */
  get type() {
    return 'DATE_PICKER';
  }

  // 自定义日期单元格的内容（month-picker/year-picker不支持）
  dateRender: TemplateRef<Date> | string | ((d: Date) => TemplateRef<Date> | string);
  // 不可选择的时间
  disabledTime: (current: Date) => { nzDisabledHours, nzDisabledMinutes, nzDisabledSeconds };
  // 增加时间选择功能
  showTime: object | boolean;
  // 是否展示“今天”按钮
  showToday = true;
  // 点击确定按钮的回调
  onOk: (date: Date) => void;

  constructor(init?: ModelPartial<DatePickerControl<M>>) {
    super();
    this.init(init);
  }
}
