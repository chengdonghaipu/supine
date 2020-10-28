import {ZorroControlModel} from './zorro-control.model';
import {TemplateRef} from '@angular/core';

type MOAbject = { [key: string]: any };

export class DateControl<M> extends ZorroControlModel<M> {
  // 是否显示清除按钮
  allowClear = true;
  // 默认面板日期
  defaultPickerValue: Date | Date[];
  // 不可选择日期
  disabledDate: (date: Date) => boolean;
  // 额外的弹出日历 className
  dropdownClassName: string;
  // 日期格式
  format: string;
  // 为 input 标签设置只读属性（避免在移动设备上触发小键盘）
  inputReadOnly = false;
  // 国际化配置
  locale: MOAbject = {};
  // 选择模式
  mode: 'date' | 'week' | 'month' | 'year' = 'date';
  // 额外的弹出日历样式
  popupStyle: MOAbject = {};
  // 在面板中添加额外的页脚
  renderExtraFooter: TemplateRef<any> | string | (() => TemplateRef<any> | string);
  // 自定义的后缀图标
  suffixIcon: string | TemplateRef<any>;
  // 弹出日历和关闭日历的回调
  onOpenChange: (open: boolean) => void;
}
