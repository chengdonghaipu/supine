import {TemplateRef} from '@angular/core';
import {BaseModel} from '@supine/dy-form';

export interface SelectOptionContent {
  value: any;
  label?: string;
  disabled?: boolean;
}

export class SelectModelControl<M = any> extends BaseModel<M> {
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

  constructor(init?: SelectModelControl) {
    super();
    this.init(init);
  }
}
