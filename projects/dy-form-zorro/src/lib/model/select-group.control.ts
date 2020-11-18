import {TemplateRef} from '@angular/core';
import {SelectControl} from './select.control';
import {GroupModel} from './group.model';
import {Const} from '@supine/dy-form';

export interface SelectOptionContent {
  value: any;
  label?: string;
  disabled?: boolean;
}

export class SelectGroupControl<M = any> extends SelectControl<M> implements GroupModel {
  @Const('SELECT_GROUP')
  type: string;

  suffixIconPv: TemplateRef<void>;

  addOnAfter: string | TemplateRef<void>;
  addOnAfterIcon: string | null;
  addOnBefore: string | TemplateRef<void>;
  addOnBeforeIcon: string | null;
  prefix: string | TemplateRef<void>;
  prefixIcon: string | null;
  suffix: string | TemplateRef<void>;
  suffixIcon: string | null;

  ngModelChange: ($event) => void = $event => {};

  openChange: (open: boolean) => void = open => {};

  constructor(init?: SelectControl) {
    super();
    this.init(init);
  }

}
