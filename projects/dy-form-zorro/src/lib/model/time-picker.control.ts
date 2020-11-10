import {ModelPartial} from '@supine/dy-form';
import {TemplateRef} from '@angular/core';
import {ZorroControlModel} from './zorro-control.model';

export class TimePickerControl<M> extends ZorroControlModel<M> {
  /**
   * type 必须要实现 不同的type代表不同的控件
   */
  // @ts-ignore
  get type() {
    return 'TIME_PICKER';
  }

  // 选择框底部显示自定义的内容
  addon: TemplateRef<void>;
  // 是否展示清除按钮
  allowEmpty = true;
  // 自动获取焦点
  autoFocus = false;
  // 清除按钮的提示文案
  clearText = 'clear';
  // 当 [ngModel] 不存在时，可以设置面板打开时默认选中的值
  defaultOpenValue: Date = new Date();
  // 禁用全部操作
  disabled = false;
  // 禁止选择部分小时选项
  disabledHours: () => number[];
  // 禁止选择部分分钟选项
  disabledMinutes: (hour: number) => number[];
  // 禁止选择部分秒选项
  disabledSeconds: (hour: number, minute: number) => number[];
  // 展示的时间格式
  format = 'HH:mm:ss';
  // 隐藏禁止选择的选项
  hideDisabledOptions = false;
  // 小时选项间隔
  hourStep = 1;
  // 分钟选项间隔
  minuteStep = 1;
  // 秒选项间隔
  secondStep = 1;
  // 弹出层类名
  popupClassName = '';
  // 使用12小时制 为true时format默认为h:mm:ss a
  use12Hours = false;
  // 自定义的后缀图标
  suffixIcon: string | TemplateRef<any>;
  // 面板打开/关闭时的回调
  openChange: (open: boolean) => void;



  get placeHolder() {
    return '请选择时间';
  }

  constructor(init?: ModelPartial<TimePickerControl<M>>) {
    super();
    this.init(init);
  }
}
