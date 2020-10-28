import {TemplateRef} from '@angular/core';
import {ZorroControlModel} from './zorro-control.model';

export interface SelectOptionContent {
  value: any;
  label?: string;
  disabled?: boolean;
}

export class SelectControl<M = any> extends ZorroControlModel<M> {
  type = 'SELECT';

  optionContent: SelectOptionContent[] = [];

  allowClear = true;

  dropdownClassName = 'dropdownClassName';

  dropdownMatchSelectWidth = true;

  dropdownStyle: { [key: string]: string };

  maxMultipleCount: number;

  mode: 'multiple' | 'tags' | 'default' = 'default';

  notFoundContent: string | TemplateRef<void>;

  showArrow = true;

  showSearch = false;

  // suffixIcon: TemplateRef<void>;

  removeIcon: TemplateRef<void>;

  clearIcon: TemplateRef<void>;

  menuItemSelectedIcon: TemplateRef<void>;

  maxTagCount: number;

  maxTagPlaceholder: TemplateRef<{ $implicit: any[] }>;

  /**
   * 加载中的开关
   */
  loading = false;

  ngModelChange: ($event) => void = $event => {};

  openChange: (open: boolean) => void = open => {};

  get placeHolder(): string {
    return `请选择${this.label}`;
  }

  constructor(init?: SelectControl) {
    super();
    this.init(init);
  }
}
