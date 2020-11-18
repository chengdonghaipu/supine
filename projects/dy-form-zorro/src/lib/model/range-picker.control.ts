import {DateControl} from './date.control';
import {Const, ModelPartial} from '@supine/dy-form';


export class RangePickerControl<M> extends DateControl<M> {
  /**
   * type 必须要实现 不同的type代表不同的控件
   */
  @Const('RANGE_PICKER')
  type: string;

  // 预设时间范围快捷选择
  ranges: { [key: string]: Date[] } | { [key: string]: () => Date[] };
  // 分隔符
  separator: string;
  // 待选日期发生变化的回调
  onCalendarChange: (date: Date[]) => void;

  showTime: object | boolean;

  disabledTime: (current: Date, partial: 'start' | 'end') => { nzDisabledHours, nzDisabledMinutes, nzDisabledSeconds };

  onOk: (date: Date[]) => void;

  get placeHolder() {
    return this._placeHolder;
  }

  constructor(init?: ModelPartial<RangePickerControl<M>>) {
    super();
    this.init(init);
  }
}
